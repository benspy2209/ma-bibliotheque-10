
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

    // Vérifier si ce livre existe déjà dans la base de données
    const { data: existingBookData } = await supabase
      .from('books')
      .select('id')
      .eq('id', book.id)
      .maybeSingle();

    // Si le livre existe déjà dans la base avec cet ID, c'est une édition - pas besoin de vérifier les doublons
    const isEditing = !!existingBookData;

    // La vérification des doublons ne s'applique qu'aux nouveaux livres
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

    // Assurons-nous que l'ID est un UUID valide pour Supabase
    // Si on édite un livre existant, on garde son ID, sinon on génère un nouveau UUID
    const bookToSave = {
      ...book,
      // Si on n'est pas en édition, on vérifie si l'ID actuel est un UUID valide
      // Si ce n'est pas le cas, on en génère un nouveau
      id: isEditing ? book.id : isValidUUID(book.id) ? book.id : uuidv4()
    };

    // Si l'ID a été modifié, on le stocke dans une propriété sourceId
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

// Fonction qui vérifie si un string est un UUID valide
function isValidUUID(id: string): boolean {
  // Regex pour valider un UUID v4
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export async function loadBooks() {
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

  // Convertir les données en objets Book
  return data?.map((row: BookRow) => row.book_data || row) ?? [];
}

export async function deleteBook(bookId: string) {
  if (!bookId) {
    throw new Error('ID du livre non fourni');
  }

  try {
    const { error } = await supabase
      .from('books')
      .delete()
      .match({ id: bookId });

    if (error) {
      console.error('Erreur Supabase:', error);
      throw new Error(`Erreur lors de la suppression : ${error.message}`);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du livre:', error);
    throw error; // Propager l'erreur pour la traiter dans le composant
  }
}

export async function getBookById(id: string) {
  const { data, error } = await supabase
    .from('books')
    .select('book_data')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erreur lors du chargement du livre:', error);
    throw error;
  }

  return data?.book_data as Book || null;
}
