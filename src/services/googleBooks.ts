
import { Book } from '@/types/book';
import { translateToFrench } from '@/utils/translation';

export const GOOGLE_BOOKS_API_KEY = 'AIzaSyDUQ2dB8e_EnUp14DY9GnYAv2CmGiqBapY';

// Liste de mots-clés techniques à exclure
const TECHNICAL_KEYWORDS = [
  'manuel', 'guide', 'prospection', 'minier', 'minière', 'géologie', 'scientifique',
  'technique', 'rapport', 'étude', 'ingénierie', 'document', 'actes', 'conférence',
  'colloque', 'symposium', 'proceedings', 'thèse', 'mémoire', 'doctorat'
];

function isTechnicalBook(title: string, description: string = '', subjects: string[] = []): boolean {
  const allText = `${title} ${description} ${subjects.join(' ')}`.toLowerCase();
  return TECHNICAL_KEYWORDS.some(keyword => allText.includes(keyword.toLowerCase()));
}

export async function searchGoogleBooks(query: string, searchType: 'author' | 'title' | 'general' = 'author'): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    // Construire la requête selon le type de recherche
    let searchQuery = '';
    switch (searchType) {
      case 'author':
        searchQuery = `inauthor:"${query}"`;
        break;
      case 'title':
        searchQuery = `intitle:"${query}"`;
        break;
      case 'general':
      default:
        searchQuery = query;
        break;
    }
    
    // Ajout du filtre de langue 'fr' pour récupérer seulement des livres en français
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&langRestrict=fr&maxResults=40&fields=items(id,volumeInfo)&key=${GOOGLE_BOOKS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Erreur Google Books: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items) {
      console.log('Aucun résultat Google Books pour:', query);
      return [];
    }
    
    const books = await Promise.all(data.items
      // Filtrer les livres sans titre ou qui ne sont pas en français
      .filter((item: any) => 
        item.volumeInfo && 
        item.volumeInfo.title &&
        (item.volumeInfo.language === 'fr' || !item.volumeInfo.language) // Accepter les livres sans langue spécifiée
      )
      .map(async (item: any) => {
        const volumeInfo = item.volumeInfo;
        
        let cover = '/placeholder.svg';
        if (volumeInfo.imageLinks) {
          cover = volumeInfo.imageLinks.extraLarge || 
                  volumeInfo.imageLinks.large || 
                  volumeInfo.imageLinks.medium || 
                  volumeInfo.imageLinks.thumbnail || 
                  volumeInfo.imageLinks.smallThumbnail;
                  
          cover = cover.replace('http:', 'https:');
        }

        // Ensure description is translated
        let description = volumeInfo.description || '';
        description = await translateToFrench(description);

        // Créer l'objet livre
        const book = {
          id: item.id,
          title: volumeInfo.title,
          author: volumeInfo.authors || ['Auteur inconnu'],
          cover: cover,
          description,
          numberOfPages: volumeInfo.pageCount,
          publishDate: volumeInfo.publishedDate,
          publishers: [volumeInfo.publisher].filter(Boolean),
          subjects: volumeInfo.categories || [],
          language: ['fr'], // Forcer la langue à français
          isbn: volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier
        };

        // Vérifier si c'est un livre technique
        if (isTechnicalBook(book.title, book.description, book.subjects)) {
          return null; // Exclure les livres techniques
        }
        
        // Si recherche par auteur, vérifier la correspondance
        if (searchType === 'author' && !isAuthorMatch(book.author, query)) {
          return null;
        }
        
        return book;
      }));

    // Filtrer les nulls (livres techniques exclus et auteurs ne correspondant pas)
    const filteredBooks = books.filter(Boolean);
    console.log(`Google Books: Trouvé ${filteredBooks.length} livres en français pour "${query}"`);
    return filteredBooks;
  } catch (error) {
    console.error('Erreur lors de la recherche Google Books:', error);
    return [];
  }
}

// Fonction utilitaire pour vérifier si un auteur correspond à la recherche
function isAuthorMatch(authorNames: string[], searchQuery: string): boolean {
  if (!authorNames || authorNames.length === 0) return false;
  
  const searchTerms = searchQuery.toLowerCase().split(' ');
  
  return authorNames.some(author => {
    if (!author) return false;
    const authorLower = author.toLowerCase();
    
    // Si le nom de l'auteur contient tous les termes de recherche
    return searchTerms.every(term => authorLower.includes(term));
  });
}
