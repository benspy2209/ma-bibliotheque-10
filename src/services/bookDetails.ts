
import { Book } from '@/types/book';
import { GOOGLE_BOOKS_API_KEY } from './googleBooks';

function cleanDescription(description: string): string {
  if (!description) return '';
  
  // Remplacer les balises <br> et <p> par des sauts de ligne
  let cleaned = description.replace(/<br\s*\/?>/gi, '\n');
  cleaned = cleaned.replace(/<p>/gi, '\n');
  cleaned = cleaned.replace(/<\/p>/gi, '\n');
  
  // Supprimer toutes les autres balises HTML
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Supprimer les caractères spéciaux et entités HTML
  cleaned = cleaned.replace(/&quot;/g, '"');
  cleaned = cleaned.replace(/&apos;/g, "'");
  cleaned = cleaned.replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  
  // Supprimer les sauts de ligne multiples
  cleaned = cleaned.replace(/\n\s*\n/g, '\n\n');
  
  // Supprimer les espaces en début et fin
  cleaned = cleaned.trim();

  return cleaned;
}

export async function getBookDetails(bookId: string): Promise<Partial<Book>> {
  if (bookId.startsWith('/works/')) {
    return getOpenLibraryDetails(bookId);
  } else {
    return getGoogleBooksDetails(bookId);
  }
}

async function getOpenLibraryDetails(bookId: string): Promise<Partial<Book>> {
  try {
    const cleanId = bookId.replace('/works/', '');
    const [workResponse, editionsResponse] = await Promise.all([
      fetch(`https://openlibrary.org/works/${cleanId}.json`),
      fetch(`https://openlibrary.org/works/${cleanId}/editions.json?limit=1`)
    ]);

    if (!workResponse.ok) {
      throw new Error('Erreur lors de la récupération des détails OpenLibrary');
    }

    const workData = await workResponse.json();
    const editionsData = editionsResponse.ok ? await editionsResponse.json() : null;
    const firstEdition = editionsData?.entries?.[0];
    
    return {
      description: cleanDescription(workData.description?.value || workData.description || ''),
      subjects: workData.subjects || [],
      series: workData?.series?.[0]?.title || '',
      numberOfPages: firstEdition?.number_of_pages || workData.number_of_pages,
      publishDate: workData.first_publish_date || firstEdition?.publish_date,
      publishers: firstEdition?.publishers || [],
    };
  } catch (error) {
    console.error('Erreur OpenLibrary:', error);
    return {};
  }
}

async function getGoogleBooksDetails(bookId: string): Promise<Partial<Book>> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${bookId}?fields=volumeInfo&key=${GOOGLE_BOOKS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des détails Google Books');
    }

    const data = await response.json();
    const volumeInfo = data.volumeInfo;
    
    return {
      description: cleanDescription(volumeInfo.description || ''),
      subjects: volumeInfo.categories || [],
      numberOfPages: volumeInfo.pageCount,
      publishDate: volumeInfo.publishedDate,
      publishers: [volumeInfo.publisher].filter(Boolean),
      isbn: volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier
    };
  } catch (error) {
    console.error('Erreur Google Books:', error);
    return {};
  }
}
