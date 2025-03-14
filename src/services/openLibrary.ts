import { Book } from '@/types/book';
import { GOOGLE_BOOKS_API_KEY } from './googleBooks';

const OPEN_LIBRARY_API = 'https://openlibrary.org';

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
    const cleanQuery = query.replace(/['"]/g, '').trim();
    const encodedQuery = encodeURIComponent(cleanQuery);
    
    const openLibraryResponse = await fetch(
      `${OPEN_LIBRARY_API}/search.json?q=${encodedQuery}&language=fre&fields=key,title,author_name,cover_i,language,first_publish_date,edition_key&limit=40&mode=everything`
    );

    if (!openLibraryResponse.ok) {
      throw new Error(`Erreur OpenLibrary: ${openLibraryResponse.status}`);
    }

    const openLibraryData = await openLibraryResponse.json();

    if (!openLibraryData.docs || openLibraryData.docs.length === 0) {
      const titleResponse = await fetch(
        `${OPEN_LIBRARY_API}/search.json?title=${encodedQuery}&language=fre&fields=key,title,author_name,cover_i,language,first_publish_date,edition_key&limit=40`
      );

      if (!titleResponse.ok) {
        throw new Error(`Erreur OpenLibrary (2ème tentative): ${titleResponse.status}`);
      }

      const titleData = await titleResponse.json();
      if (!titleData.docs || titleData.docs.length === 0) {
        console.log('Aucun résultat OpenLibrary pour:', query);
        return [];
      }
      openLibraryData.docs = titleData.docs;
    }

    const results = await Promise.all(
      openLibraryData.docs
        .filter((doc: any) => {
          const hasAuthor = doc.author_name && doc.author_name.length > 0;
          const isInFrench = doc.language?.includes('fre') || doc.language?.includes('fra');
          return hasAuthor && isInFrench;
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

          return {
            id: doc.key,
            title: doc.title,
            author: doc.author_name || ['Auteur inconnu'],
            cover: cover,
            language: doc.language || [],
            publishDate: doc.first_publish_date,
            description: bookDetails?.description?.value || bookDetails?.description || '',
            numberOfPages: editionDetails?.number_of_pages || bookDetails?.number_of_pages,
            subjects: bookDetails?.subjects || [],
            publishers: editionDetails?.publishers || []
          };
        })
    );

    return results.filter(Boolean);
  } catch (error) {
    console.error('Erreur lors de la recherche OpenLibrary:', error);
    return [];
  }
}
