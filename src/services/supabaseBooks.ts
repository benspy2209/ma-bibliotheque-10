
import { Book } from '@/types/book';
import { isDuplicateBook } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { BookRow } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function saveBook(book: Book) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Vous devez être connecté pour effectuer cette action');
    }

    const { data: existingBookData } = await supabase
      .from('books')
      .select('id')
      .eq('id', book.id)
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

    const { error } = await supabase
      .from('books')
      .upsert({
        id: bookToSave.id,
        book_data: bookToSave,
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
    const { data: { user } } = await supabase.auth.getUser();
    
    console.log("Utilisateur actuel:", user);
    
    if (!user) {
      console.log("Aucun utilisateur connecté, retour d'une liste vide");
      return [];
    }
    
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    console.log("Données reçues:", data);
    console.log("Erreur éventuelle:", error);

    if (error) {
      console.error('Erreur lors du chargement des livres:', error);
      throw error;
    }

    return data?.map((row: BookRow) => row.book_data || row) ?? [];
  } catch (error) {
    console.error('Erreur lors du chargement des livres:', error);
    return [];
  }
}

export async function getBookById(id: string) {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('book_data')
      .eq('id', id)
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
    console.log('Attempting to delete book with ID:', bookId);
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Error getting current user:', authError);
      throw new Error(`Erreur d'authentification: ${authError.message}`);
    }
    
    if (!user) {
      console.error('No user found when attempting to delete book');
      throw new Error('Vous devez être connecté pour effectuer cette action');
    }
    
    console.log('User authenticated, proceeding with book deletion');
    
    // First verify the book exists and belongs to this user
    const { data: bookData, error: checkError } = await supabase
      .from('books')
      .select('id, user_id')
      .eq('id', bookId)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking book existence:', checkError);
      throw new Error(`Erreur lors de la vérification : ${checkError.message}`);
    }
    
    if (!bookData) {
      console.error('Book not found or does not belong to user');
      throw new Error('Ce livre n\'existe pas ou ne vous appartient pas');
    }
    
    if (bookData.user_id !== user.id) {
      console.error('Book does not belong to current user');
      throw new Error('Ce livre ne vous appartient pas');
    }

    console.log('Book found and belongs to user, proceeding with deletion');

    // Finally delete the book
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId)
      .eq('user_id', user.id); // Extra security check

    if (error) {
      console.error('Supabase error during deletion:', error);
      throw new Error(`Erreur lors de la suppression : ${error.message}`);
    }
    
    console.log('Book successfully deleted');
    return { success: true };
  } catch (error) {
    console.error('Error during book deletion:', error);
    throw error; // Propager l'erreur pour la traiter dans le composant
  }
}
