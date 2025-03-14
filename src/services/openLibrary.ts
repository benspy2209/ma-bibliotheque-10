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
    // Effectuer les deux recherches en parallèle
    const [openLibraryResponse, googleBooksResponse] = await Promise.all([
      fetch(
        `${OPEN_LIBRARY_API}/search.json?q=${encodeURIComponent(query)}&language=fre&fields=key,title,author_name,cover_i,language,first_publish_date,edition_key&limit=40`
      ),
      fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&langRestrict=fr&maxResults=40&fields=items(id,volumeInfo)&key=${GOOGLE_BOOKS_API_KEY}`
      )
    ]);

    const openLibraryData = await openLibraryResponse.json();
    const googleBooksData = await googleBooksResponse.json();

    // Traitement des résultats d'OpenLibrary avec filtre strict sur la langue
    const openLibraryBooks = await Promise.all(
      openLibraryData.docs
        .filter((doc: any) => {
          const isInFrench = doc.language?.some((lang: string) => 
            ['fre', 'fra'].includes(lang.toLowerCase())
          );
          return isInFrench;
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
            const googleCover = await searchGoogleBooksCover(doc.title, doc.author_name?.[0] || '');
            cover = googleCover || 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800';
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

    // Traitement des résultats de Google Books avec filtre strict sur la langue
    const googleBooks = (googleBooksData.items || [])
      .filter((item: any) => item.volumeInfo.language === 'fr')
      .map((item: any) => {
        const volumeInfo = item.volumeInfo;
        let cover = 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800';
        
        if (volumeInfo.imageLinks) {
          cover = volumeInfo.imageLinks.thumbnail?.replace('http:', 'https:') ||
                  volumeInfo.imageLinks.smallThumbnail?.replace('http:', 'https:');
        }

        return {
          id: item.id,
          title: volumeInfo.title,
          author: volumeInfo.authors || ['Auteur inconnu'],
          cover: cover,
          language: [volumeInfo.language],
          publishDate: volumeInfo.publishedDate,
          description: volumeInfo.description || '',
          numberOfPages: volumeInfo.pageCount,
          subjects: volumeInfo.categories || [],
          publishers: [volumeInfo.publisher].filter(Boolean)
        };
      });

    // Combiner et retourner les résultats des deux APIs
    return [...openLibraryBooks, ...googleBooks];
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
}
