
import { Book } from '@/types/book';

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

export async function searchBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    const response = await fetch(
      `${OPEN_LIBRARY_API}/search.json?q=${encodeURIComponent(query)}&language=fre&fields=key,title,author_name,cover_i,language,first_publish_date,edition_key&limit=40`
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la recherche');
    }

    const data = await response.json();
    
    const books = await Promise.all(
      data.docs
        .filter((doc: any) => 
          doc.author_name?.some((author: string) => 
            author.toLowerCase() === query.toLowerCase()
          ) && 
          (doc.language?.includes('fre') || doc.language?.includes('fra'))
        )
        .map(async (doc: any) => {
          // Récupérer les détails du livre
          const bookDetails = await fetchBookDetails(doc.key);
          
          // Récupérer les détails de la première édition si disponible
          let editionDetails = null;
          if (doc.edition_key?.[0]) {
            editionDetails = await fetchEditionDetails(doc.edition_key[0]);
          }

          return {
            id: doc.key,
            title: doc.title,
            author: doc.author_name || ['Auteur inconnu'],
            cover: doc.cover_i 
              ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
              : '/placeholder.svg',
            language: doc.language || [],
            publishDate: doc.first_publish_date,
            description: bookDetails?.description?.value || bookDetails?.description || '',
            numberOfPages: editionDetails?.number_of_pages || bookDetails?.number_of_pages,
            subjects: bookDetails?.subjects || [],
            publishers: editionDetails?.publishers || []
          };
        })
    );

    return books;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
}
