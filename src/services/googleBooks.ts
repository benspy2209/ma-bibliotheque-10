
import { Book } from '@/types/book';

export const GOOGLE_BOOKS_API_KEY = 'AIzaSyDUQ2dB8e_EnUp14DY9GnYAv2CmGiqBapY';

export async function searchGoogleBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=inauthor:"${encodeURIComponent(query)}"&langRestrict=fr&maxResults=40&key=${GOOGLE_BOOKS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la recherche Google Books');
    }

    const data = await response.json();
    
    return data.items?.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors || ['Auteur inconnu'],
      cover: item.volumeInfo.imageLinks?.thumbnail || '/placeholder.svg',
      description: item.volumeInfo.description,
      numberOfPages: item.volumeInfo.pageCount,
      publishDate: item.volumeInfo.publishedDate,
      publishers: [item.volumeInfo.publisher],
      subjects: item.volumeInfo.categories,
      language: [item.volumeInfo.language]
    }))
    ?.filter(book => {
      const authors = Array.isArray(book.author) ? book.author : [book.author];
      return authors.some(author => 
        author.toLowerCase() === query.toLowerCase()
      ) && book.language[0] === 'fr';
    }) || [];
  } catch (error) {
    console.error('Erreur lors de la recherche Google Books:', error);
    return [];
  }
}
