import { Book } from '@/types/book';
import { isDuplicateBook } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { BookRow } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function saveBook(book: Book) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      throw new Error('Vous devez être connecté pour effectuer cette action');
    }
    
    console.log('Saving book for user:', user.id);

    const { data: existingBookData } = await supabase
      .from('books')
      .select('id')
      .eq('id', book.id)
      .eq('user_id', user.id)  // Ensure we're only looking at the user's own books
      .maybeSingle();

    const isEditing = !!existingBookData;

    if (!isEditing) {
      const existingBooks = await loadBooks();
      
      const existingBook = existingBooks.find(b => isDuplicateBook([b], book));
      
      if (existingBook) {
        return {
          success: false,
          error: 'duplicate',
          existingBook,
          message: 'Ce livre est déjà dans votre bibliothèque'
        };
      }
    }

    const bookToSave = {
      ...book,
      id: isEditing ? book.id : isValidUUID(book.id) ? book.id : uuidv4()
    };

    if (book.id !== bookToSave.id) {
      bookToSave.sourceId = book.id;
    }

    // Ajout d'un timestamp pour forcer la détection du changement
    const updatedBook = {
      ...bookToSave,
      _lastUpdated: new Date().toISOString()
    };

    // Log the save operation for debugging
    console.log('Saving book with status:', book.status, 'and ID:', bookToSave.id);
    console.log('Book data to save:', updatedBook);
    console.log('User ID for book save:', user.id);

    const { error } = await supabase
      .from('books')
      .upsert({
        id: bookToSave.id,
        book_data: updatedBook,
        status: book.status,
        completion_date: book.completionDate,
        user_id: user.id
      });

    if (error) {
      console.error('Erreur Supabase lors de la sauvegarde:', error);
      return {
        success: false,
        error: 'database',
        message: `Erreur lors de la sauvegarde : ${error.message}`
      };
    }
    
    console.log('Book saved successfully with ID:', bookToSave.id, 'and status:', book.status);
    
    // Invalidate books query after successful save
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return {
      success: false,
      error: 'unknown',
      message: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export async function loadBooks() {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Authentication error when loading books:', authError);
      return [];
    }
    
    console.log("Utilisateur actuel:", user?.id);
    
    if (!user) {
      console.log("Aucun utilisateur connecté, retour d'une liste vide");
      return [];
    }
    
    // Add a timestamp parameter to force a fresh fetch every time and never use cached results
    const timestamp = new Date().getTime();
    
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    console.log("Données reçues:", data?.length, "livres");
    
    if (error) {
      console.error('Erreur lors du chargement des livres:', error);
      throw error;
    }

    // Log status distribution for debugging
    const booksByStatus = data?.reduce((acc, row: BookRow) => {
      const status = row.status || 'undefined';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log("Distribution des statuts:", booksByStatus);
    console.log("Livres récupérés pour l'utilisateur:", user.id);

    return data?.map((row: BookRow) => {
      const bookData = row.book_data || row;
      // Ensure the status from the database row is used
      return {
        ...bookData,
        status: row.status || bookData.status
      };
    }) ?? [];
  } catch (error) {
    console.error('Erreur lors du chargement des livres:', error);
    return [];
  }
}

export async function getBookById(id: string) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error when getting book by ID:', authError);
      throw new Error('Vous devez être connecté pour effectuer cette action');
    }
    
    const { data, error } = await supabase
      .from('books')
      .select('book_data')
      .eq('id', id)
      .eq('user_id', user.id) // Ensure we only get books belonging to the current user
      .maybeSingle();

    if (error) {
      console.error('Erreur lors du chargement du livre:', error);
      throw error;
    }

    return data?.book_data as Book || null;
  } catch (error) {
    console.error('Erreur lors du chargement du livre par ID:', error);
    return null;
  }
}

export async function deleteBook(bookId: string) {
  if (!bookId) {
    throw new Error('ID du livre non fourni');
  }

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error when deleting book:', authError);
      throw new Error('Vous devez être connecté pour effectuer cette action');
    }
    
    console.log('Tentative de suppression du livre:', bookId);
    console.log('Utilisateur:', user.id);
    
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Erreur lors de la suppression:', error);
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
    
    console.log('Livre supprimé avec succès');
    return { success: true };
  } catch (error) {
    console.error('Erreur pendant la suppression:', error);
    throw error;
  }
}

/**
 * Searches for books by title in the current user's library
 * @param title The title to search for (case insensitive, partial match)
 * @returns Array of books matching the search criteria
 */
export async function searchBooksByTitle(title: string): Promise<Book[]> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error when searching books:', authError);
      return [];
    }
    
    console.log(`Searching for books with title containing: "${title}"`);
    
    // Use Postgres ILIKE for case-insensitive search
    // We need to search inside the jsonb book_data -> title field
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', user.id)
      .filter('book_data->title', 'ilike', `%${title}%`);
    
    if (error) {
      console.error('Error searching books by title:', error);
      return [];
    }
    
    console.log(`Found ${data?.length} books matching the search`);
    
    return data?.map((row: BookRow) => {
      const bookData = row.book_data || row;
      return {
        ...bookData,
        status: row.status || bookData.status
      };
    }) ?? [];
  } catch (error) {
    console.error('Error during book search:', error);
    return [];
  }
}
