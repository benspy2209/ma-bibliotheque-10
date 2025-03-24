
import { Book } from '@/types/book';
import { supabase } from '@/integrations/supabase/client';
import { translateToFrench } from '@/utils/translation';

const GOOGLE_BOOKS_API_KEY = 'AIzaSyDUQ2dB8e_EnUp14DY9GnYAv2CmGiqBapY';

export async function getBookDetails(bookId: string): Promise<Partial<Book>> {
  try {
    // Si l'ID commence par "ol-isbn-", alors c'est un livre OpenLibrary par ISBN
    if (bookId.startsWith('ol-isbn-')) {
      const isbn = bookId.replace('ol-isbn-', '');
      // Dans ce cas, nous avons déjà les détails complets dans le résultat initial
      console.log(`Détails déjà complets pour ISBN ${isbn}`);
      return {};
    }
    
    // Si l'ID commence par un autre préfixe OpenLibrary
    if (bookId.startsWith('/works/')) {
      // Récupérer les détails OpenLibrary
      const response = await fetch(`https://openlibrary.org${bookId}.json`);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des détails OpenLibrary: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Récupérer la description
      let description = data.description?.value || data.description || '';
      
      // Traduire la description si nécessaire
      if (description && typeof description === 'string') {
        description = await translateToFrench(description);
      }
      
      return {
        description,
        subjects: data.subjects || []
      };
    } else {
      // Sinon, c'est un livre Google Books
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${bookId}?fields=volumeInfo&key=${GOOGLE_BOOKS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des détails Google Books: ${response.status}`);
      }
      
      const data = await response.json();
      const volumeInfo = data.volumeInfo;
      
      // Vérifier si le livre est déjà dans la bibliothèque de l'utilisateur
      let status = undefined;
      try {
        const { data: bookData } = await supabase
          .from('books')
          .select('status')
          .eq('book_data->>id', bookId)
          .maybeSingle();
          
        if (bookData) {
          status = bookData.status;
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut du livre:", error);
      }
      
      // Traduire la description si nécessaire
      let description = volumeInfo?.description || '';
      if (description) {
        description = await translateToFrench(description);
      }
      
      return {
        description,
        subjects: volumeInfo?.categories || [],
        numberOfPages: volumeInfo?.pageCount,
        publishDate: volumeInfo?.publishedDate,
        publishers: volumeInfo?.publisher ? [volumeInfo.publisher] : [],
        status
      };
    }
  } catch (error) {
    console.error("Erreur Google Books:", error);
    return {};
  }
}
