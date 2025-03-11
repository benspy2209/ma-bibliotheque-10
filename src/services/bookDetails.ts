
import { Book } from '@/types/book';

export async function getBookDetails(bookId: string): Promise<Partial<Book>> {
  try {
    const cleanId = bookId.replace('/works/', '');
    const response = await fetch(`https://openlibrary.org/works/${cleanId}.json`);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des détails');
    }

    const data = await response.json();
    
    return {
      description: data.description?.value || data.description || '',
      subjects: data.subjects || [],
      series: data?.series?.[0]?.title || '',
      numberOfPages: data.number_of_pages,
      publishDate: data.first_publish_date,
      publishers: data.publishers,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des détails:', error);
    return {};
  }
}
