import { Book } from '@/types/book';
import { GOOGLE_BOOKS_API_KEY } from './googleBooks';

function cleanDescription(description: string): string {
  if (!description) return '';
  
  // Remplacer les balises <br> par des sauts de ligne
  let cleaned = description.replace(/<br\s*\/?>/g, '\n');
  
  // Supprimer toutes les autres balises HTML
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Supprimer les sauts de ligne multiples
  cleaned = cleaned.replace(/\n\s*\n/g, '\n');
  
  // Supprimer les espaces en début et fin
  cleaned = cleaned.trim();

  return cleaned;
}

export async function getBookDetails(bookId: string): Promise<Partial<Book>> {
  if (bookId.startsWith('/works/')) {
    // OpenLibrary book
    return getOpenLibraryDetails(bookId);
  } else {
    // Google Books
    return getGoogleBooksDetails(bookId);
  }
}

async function getOpenLibraryDetails(bookId: string): Promise<Partial<Book>> {
  try {
    const cleanId = bookId.replace('/works/', '');
    const response = await fetch(`https://openlibrary.org/works/${cleanId}.json`);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des détails OpenLibrary');
    }

    const data = await response.json();
    
    return {
      description: cleanDescription(data.description?.value || data.description || ''),
      subjects: data.subjects || [],
      series: data?.series?.[0]?.title || '',
      numberOfPages: data.number_of_pages,
      publishDate: data.first_publish_date,
      publishers: data.publishers,
    };
  } catch (error) {
    console.error('Erreur OpenLibrary:', error);
    return {};
  }
}

async function getGoogleBooksDetails(bookId: string): Promise<Partial<Book>> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${GOOGLE_BOOKS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des détails Google Books');
    }

    const data = await response.json();
    
    return {
      description: cleanDescription(data.volumeInfo.description || ''),
      subjects: data.volumeInfo.categories || [],
      numberOfPages: data.volumeInfo.pageCount,
      publishDate: data.volumeInfo.publishedDate,
      publishers: [data.volumeInfo.publisher],
    };
  } catch (error) {
    console.error('Erreur Google Books:', error);
    return {};
  }
}
