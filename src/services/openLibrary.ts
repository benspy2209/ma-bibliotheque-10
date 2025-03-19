
import { Book } from '@/types/book';
import { GOOGLE_BOOKS_API_KEY } from './googleBooks'; 
import { translateToFrench } from '@/utils/translation';

const OPEN_LIBRARY_API = 'https://openlibrary.org';

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

async function fetchBookDetails(key: string): Promise<any> {
  try {
    const response = await fetch(`${OPEN_LIBRARY_API}${key}.json`);
    if (!response.ok) {
      console.error(`Erreur OpenLibrary (${key}):`, response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des détails:', error);
    return null;
  }
}

async function fetchEditionDetails(editionKey: string): Promise<any> {
  try {
    const response = await fetch(`${OPEN_LIBRARY_API}/books/${editionKey}.json`);
    if (!response.ok) {
      console.error(`Erreur édition OpenLibrary (${editionKey}):`, response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des éditions:', error);
    return null;
  }
}

async function searchGoogleBooksCover(title: string, author: string): Promise<string | null> {
  try {
    const query = `${title} ${author}`;
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&fields=items(volumeInfo(imageLinks))&key=${GOOGLE_BOOKS_API_KEY}`
    );

    if (!response.ok) return null;
    
    const data = await response.json();
    const imageLinks = data.items?.[0]?.volumeInfo?.imageLinks;
    
    if (imageLinks) {
      return imageLinks.thumbnail?.replace('http:', 'https:') ||
             imageLinks.smallThumbnail?.replace('http:', 'https:');
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la recherche Google Books:', error);
    return null;
  }
}

export async function searchBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    // Ajouter une exclusion pour certains sujets techniques avec -subject:
    // et exclure les revues et journaux
    const encodedQuery = encodeURIComponent(query.replace(/['"]/g, ''));
    const openLibraryResponse = await fetch(
      `${OPEN_LIBRARY_API}/search.json?q=${encodedQuery}+language:fre&fields=key,title,author_name,cover_i,language,first_publish_date,edition_key,subject&limit=40`
    );

    if (!openLibraryResponse.ok) {
      throw new Error(`Erreur OpenLibrary: ${openLibraryResponse.status}`);
    }

    const openLibraryData = await openLibraryResponse.json();

    if (!openLibraryData.docs || openLibraryData.docs.length === 0) {
      console.log('Aucun résultat OpenLibrary pour:', query);
      return [];
    }

    const results = await Promise.all(
      openLibraryData.docs
        .filter((doc: any) => {
          // Filtrer les résultats sans titre ou auteur, et vérifier que la langue est le français
          const hasTitle = doc.title && typeof doc.title === 'string';
          const hasAuthor = doc.author_name && doc.author_name.length > 0;
          const isFrench = doc.language && 
                          (doc.language.includes('fre') || 
                           doc.language.includes('fra') || 
                           doc.language.includes('fr'));
                           
          // Vérifier si le titre contient des mots-clés techniques
          if (hasTitle && isTechnicalBook(doc.title, '', doc.subject || [])) {
            return false; // Exclure les documents techniques
          }
          
          return hasTitle && hasAuthor && isFrench;
        })
        .map(async (doc: any) => {
          const bookDetails = await fetchBookDetails(doc.key);
          let editionDetails = null;
          
          if (doc.edition_key?.[0]) {
            editionDetails = await fetchEditionDetails(doc.edition_key[0]);
          }

          let cover = '/placeholder.svg';
          if (doc.cover_i) {
            cover = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
          } else {
            const googleCover = await searchGoogleBooksCover(doc.title, doc.author_name?.[0] || '');
            if (googleCover) cover = googleCover;
          }

          const description = await translateToFrench(
            bookDetails?.description?.value || 
            bookDetails?.description || 
            ''
          );

          const book = {
            id: doc.key,
            title: doc.title,
            author: doc.author_name || ['Auteur inconnu'],
            cover: cover,
            language: ['fr'], // Forcer la langue à français
            publishDate: doc.first_publish_date,
            description,
            numberOfPages: editionDetails?.number_of_pages || bookDetails?.number_of_pages,
            subjects: bookDetails?.subjects || [],
            publishers: editionDetails?.publishers || []
          };

          // Vérifier à nouveau avec la description complète
          if (isTechnicalBook(book.title, book.description, book.subjects)) {
            return null; // Exclure les livres techniques
          }
          
          return book;
        })
    );

    const frenchResults = results.filter(Boolean);
    console.log(`OpenLibrary: Trouvé ${frenchResults.length} livres en français non-techniques pour "${query}"`);
    return frenchResults;
  } catch (error) {
    console.error('Erreur lors de la recherche OpenLibrary:', error);
    return [];
  }
}
