import { Book } from '@/types/book';
import { GOOGLE_BOOKS_API_KEY } from './googleBooks';

const OPEN_LIBRARY_API = 'https://openlibrary.org';

async function fetchBookDetails(key: string): Promise<any> {
  try {
    const response = await fetch(`${OPEN_LIBRARY_API}${key}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des détails:', error);
    return null;
  }
}

async function fetchEditionDetails(editionKey: string): Promise<any> {
  try {
    const response = await fetch(`${OPEN_LIBRARY_API}/books/${editionKey}.json`);
    if (!response.ok) return null;
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
    const openLibraryResponse = await fetch(
      `${OPEN_LIBRARY_API}/search.json?q=${encodeURIComponent(query)}&language=fre&fields=key,title,author_name,cover_i,language,first_publish_date,edition_key,language&limit=40`
    );

    if (!openLibraryResponse.ok) {
      throw new Error('Erreur lors de la recherche OpenLibrary');
    }

    const openLibraryData = await openLibraryResponse.json();

    // Filtre strict sur la langue française
    const openLibraryBooks = await Promise.all(
      (openLibraryData.docs || [])
        .filter((doc: any) => {
          const languages = doc.language || [];
          return languages.some((lang: string) => 
            ['fre', 'fra', 'fr'].includes(lang.toLowerCase())
          );
        })
        .map(async (doc: any) => {
          const bookDetails = await fetchBookDetails(doc.key);
          let editionDetails = null;
          if (doc.edition_key?.[0]) {
            editionDetails = await fetchEditionDetails(doc.edition_key[0]);
          }

          let cover;
          if (doc.cover_i) {
            cover = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
          } else {
            cover = '/placeholder.svg';
          }

          return {
            id: doc.key,
            title: doc.title,
            author: doc.author_name || ['Auteur inconnu'],
            cover: cover,
            language: ['fr'],
            publishDate: doc.first_publish_date,
            description: bookDetails?.description?.value || bookDetails?.description || '',
            numberOfPages: editionDetails?.number_of_pages || bookDetails?.number_of_pages,
            subjects: bookDetails?.subjects || [],
            publishers: editionDetails?.publishers || []
          };
        })
    );

    return openLibraryBooks;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
}
