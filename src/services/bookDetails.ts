
import { Book } from '@/types/book';
import { supabase } from '@/integrations/supabase/client';
import { translateToFrench } from '@/utils/translation';

const GOOGLE_BOOKS_API_KEY = 'AIzaSyDUQ2dB8e_EnUp14DY9GnYAv2CmGiqBapY';

export async function getBookDetails(bookId: string): Promise<Partial<Book>> {
  try {
    // Si l'ID commence par "ol-isbn-", alors c'est un livre OpenLibrary par ISBN
    if (bookId.startsWith('ol-isbn-')) {
      const isbn = bookId.replace('ol-isbn-', '');
      console.log(`Recherche de détails supplémentaires pour ISBN ${isbn} via Google Books`);
      
      // Essayer de récupérer plus de détails via l'API Google Books pour enrichir
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&fields=items(id,volumeInfo)&key=${GOOGLE_BOOKS_API_KEY}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            const volumeInfo = data.items[0].volumeInfo;
            let description = volumeInfo?.description || '';
            
            if (description) {
              description = await translateToFrench(description);
            }
            
            console.log(`Détails enrichis trouvés pour ISBN ${isbn} via Google Books`);
            return {
              description,
              subjects: volumeInfo?.categories || [],
              numberOfPages: volumeInfo?.pageCount,
              publishDate: volumeInfo?.publishedDate,
              publishers: volumeInfo?.publisher ? [volumeInfo.publisher] : []
            };
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails Google Books pour ISBN:', error);
      }
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
      
      // Récupérer la couverture si disponible
      let cover = '/placeholder.svg';
      if (data.covers && data.covers.length > 0) {
        cover = `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`;
      }
      
      return {
        description,
        subjects: data.subjects || [],
        cover
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
      
      // Gestion améliorée des couvertures
      let cover = '/placeholder.svg';
      if (volumeInfo.imageLinks) {
        cover = volumeInfo.imageLinks.extraLarge || 
                volumeInfo.imageLinks.large || 
                volumeInfo.imageLinks.medium || 
                volumeInfo.imageLinks.thumbnail || 
                volumeInfo.imageLinks.smallThumbnail;
        
        cover = cover.replace('http:', 'https:');
      }
      
      return {
        description,
        subjects: volumeInfo?.categories || [],
        numberOfPages: volumeInfo?.pageCount,
        publishDate: volumeInfo?.publishedDate,
        publishers: volumeInfo?.publisher ? [volumeInfo.publisher] : [],
        status,
        cover
      };
    }
    
    return {};
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du livre:", error);
    return {};
  }
}
