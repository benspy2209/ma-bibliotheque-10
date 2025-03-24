
import { Book } from '@/types/book';
import { translateToFrench } from '@/utils/translation';
import { looksLikeISBN } from '@/lib/utils';

export const GOOGLE_BOOKS_API_KEY = 'AIzaSyDUQ2dB8e_EnUp14DY9GnYAv2CmGiqBapY';

// Liste de mots-clés techniques à exclure
const TECHNICAL_KEYWORDS = [
  'manuel', 'guide', 'prospection', 'minier', 'minière', 'géologie', 'scientifique',
  'technique', 'rapport', 'étude', 'ingénierie', 'document', 'actes', 'conférence',
  'colloque', 'symposium', 'proceedings', 'thèse', 'mémoire', 'doctorat'
];

function isTechnicalBook(title: string, description: string = '', subjects: string[] = []): boolean {
  const allText = `${title} ${description} ${subjects.join(' ')}`.toLowerCase();
  
  // Vérifier si le titre ou la description contient des mots-clés techniques
  return TECHNICAL_KEYWORDS.some(keyword => allText.includes(keyword.toLowerCase()));
}

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

export async function searchGoogleBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    // Déterminer si la requête est un ISBN
    const isISBNQuery = looksLikeISBN(query);
    
    // Construire la requête en fonction du type de recherche
    let searchQuery;
    if (isISBNQuery) {
      // Recherche directe par ISBN
      const cleanISBN = query.replace(/[-\s]/g, '');
      searchQuery = `isbn:${cleanISBN}`;
    } else {
      // Recherche par auteur
      searchQuery = `inauthor:"${query}"`;
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
      console.log(`Aucun résultat Google Books pour: ${query}`);
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
        if (description && description.length > 0) {
          description = await translateToFrench(description);
        }

        // Récupérer l'ISBN si disponible
        const isbn13 = volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier;
        const isbn10 = volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_10')?.identifier;
        const isbn = isbn13 || isbn10;

        // Pour les recherches par ISBN, faire une recherche plus approfondie pour obtenir une couverture
        if (isISBNQuery && !volumeInfo.imageLinks) {
          try {
            // Utiliser l'API Open Library pour tenter de récupérer une couverture
            const cleanISBN = query.replace(/[-\s]/g, '');
            const olResponse = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${cleanISBN}&jscmd=data&format=json`);
            if (olResponse.ok) {
              const olData = await olResponse.json();
              const olBook = olData[`ISBN:${cleanISBN}`];
              if (olBook && olBook.cover) {
                cover = olBook.cover.medium || olBook.cover.large || olBook.cover.small;
              }
            }
          } catch (error) {
            console.error('Erreur lors de la récupération de la couverture OpenLibrary:', error);
          }
        }

        // Créer l'objet livre avec données complètes
        const book = {
          id: item.id,
          title: volumeInfo.title || 'Titre inconnu',
          author: volumeInfo.authors || ['Auteur inconnu'],
          cover: cover,
          description,
          numberOfPages: volumeInfo.pageCount,
          publishDate: volumeInfo.publishedDate,
          publishers: volumeInfo.publisher ? [volumeInfo.publisher] : [],
          subjects: volumeInfo.categories || [],
          language: ['fr'], // Forcer la langue à français
          isbn: isbn
        };

        // Si c'est une recherche par ISBN, ne pas appliquer les filtres additionnels
        if (isISBNQuery) {
          return book;
        }
        
        // Pour les recherches par auteur, appliquer les filtres additionnels
        // Vérifier si c'est un livre technique
        if (isTechnicalBook(book.title, book.description, book.subjects)) {
          return null; // Exclure les livres techniques
        }
        
        // Vérifier si l'auteur correspond à la recherche
        if (!isAuthorMatch(book.author, query)) {
          return null; // Exclure les livres d'autres auteurs
        }
        
        return book;
      }));

    // Filtrer les nulls (livres techniques exclus et auteurs ne correspondant pas)
    const filteredBooks = books.filter(Boolean);
    
    if (isISBNQuery) {
      console.log(`Google Books: Trouvé ${filteredBooks.length} livre(s) avec l'ISBN "${query}"`);
    } else {
      console.log(`Google Books: Trouvé ${filteredBooks.length} livres en français de l'auteur "${query}"`);
    }
    
    return filteredBooks;
  } catch (error) {
    console.error('Erreur lors de la recherche Google Books:', error);
    return [];
  }
}
