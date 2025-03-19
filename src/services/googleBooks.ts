
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
  
  // Vérifier si le titre ou la description contient des mots-clés techniques
  return TECHNICAL_KEYWORDS.some(keyword => allText.includes(keyword.toLowerCase()));
}

export async function searchGoogleBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    // Ajout du filtre de langue 'fr' pour récupérer seulement des livres en français
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&langRestrict=fr&maxResults=40&fields=items(id,volumeInfo)&key=${GOOGLE_BOOKS_API_KEY}`
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
        
        return book;
      }));

    // Filtrer les nulls (livres techniques exclus)
    const filteredBooks = books.filter(Boolean);
    console.log(`Google Books: Trouvé ${filteredBooks.length} livres en français non-techniques pour "${query}"`);
    return filteredBooks;
  } catch (error) {
    console.error('Erreur lors de la recherche Google Books:', error);
    return [];
  }
}
