import { Book } from '@/types/book';
import { GOOGLE_BOOKS_API_KEY } from './googleBooks'; 
import { translateToFrench } from '@/utils/translation';
import { getCachedSearch, cacheSearchResults } from './searchCache';

const OPEN_LIBRARY_API = 'https://openlibrary.org';
const FETCH_TIMEOUT = 5000; // 5 secondes timeout

async function fetchWithTimeout(url: string, options = {}): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function fetchBookDetails(key: string): Promise<any> {
  try {
    const response = await fetchWithTimeout(`${OPEN_LIBRARY_API}${key}.json`);
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
    const response = await fetchWithTimeout(`${OPEN_LIBRARY_API}/books/${editionKey}.json`);
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

export async function searchOpenLibrary(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    const encodedQuery = encodeURIComponent(query.replace(/['"]/g, ''));
    
    const openLibraryResponse = await fetchWithTimeout(
      `${OPEN_LIBRARY_API}/search.json?q=${encodedQuery}` +
      `&fields=key,title,author_name,cover_i,language,first_publish_date,edition_key` +
      `&limit=200` + // Augmenté de 100 à 200
      `&type=work`
    );

    if (!openLibraryResponse.ok) {
      console.error(`Erreur OpenLibrary: ${openLibraryResponse.status}`);
      return [];
    }

    const openLibraryData = await openLibraryResponse.json();

    if (!openLibraryData.docs || openLibraryData.docs.length === 0) {
      console.log('Aucun résultat OpenLibrary pour:', query);
      return [];
    }

    const results = await Promise.all(
      openLibraryData.docs
        .filter((doc: any) => doc.author_name?.length > 0)
        .map(async (doc: any) => {
          try {
            const [bookDetails, editionDetails] = await Promise.all([
              fetchBookDetails(doc.key),
              doc.edition_key?.[0] ? fetchEditionDetails(doc.edition_key[0]) : null
            ]);

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

            return {
              id: doc.key,
              title: doc.title,
              author: doc.author_name || ['Auteur inconnu'],
              cover,
              language: doc.language || [],
              publishDate: doc.first_publish_date,
              description,
              numberOfPages: editionDetails?.number_of_pages || bookDetails?.number_of_pages,
              subjects: bookDetails?.subjects || [],
              publishers: editionDetails?.publishers || []
            };
          } catch (error) {
            console.error('Erreur lors du traitement du livre:', error);
            return null;
          }
        })
    );

    return results.filter(Boolean) as Book[];

  } catch (error) {
    console.error('Erreur lors de la recherche OpenLibrary:', error);
    return [];
  }
}
