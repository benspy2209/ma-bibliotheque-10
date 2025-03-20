import { createClient } from '@supabase/supabase-js';
import { Book } from '@/types/book';
import { isDuplicateBook } from '@/lib/utils';

const supabaseUrl = 'https://ckeptymeczykfnbfcfuq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrZXB0eW1lY3p5a2ZuYmZjZnVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MDM2MzEsImV4cCI6MjA1NzM3OTYzMX0.bwd0xD497DJmS5TN7UtNXVav-tB_5j0g6k2mgGENczo';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Les variables d\'environnement Supabase ne sont pas configurées.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storage: window.localStorage,
    autoRefreshToken: true
  }
});

export async function saveBook(book: Book) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Vous devez être connecté pour effectuer cette action');
    }

    // Vérifier si le livre est un doublon avant de l'enregistrer
    const existingBooks = await loadBooks();
    
    // Vérification améliorée: on extrait d'abord le livre existant s'il y en a un
    const existingBook = existingBooks.find(b => isDuplicateBook([b], book));
    
    if (existingBook) {
      // On renvoie le livre existant au lieu de lancer une erreur
      // pour permettre une meilleure gestion par l'interface
      return {
        success: false,
        error: 'duplicate',
        existingBook,
        message: 'Ce livre est déjà dans votre bibliothèque'
      };
    }

    const { error } = await supabase
      .from('books')
      .upsert({
        id: book.id,
        book_data: book,
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

export async function loadBooks() {
  const { data: { user } } = await supabase.auth.getUser();
  
  console.log("Utilisateur actuel:", user);
  
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });

  console.log("Données reçues:", data);
  console.log("Erreur éventuelle:", error);

  if (error) {
    console.error('Erreur lors du chargement des livres:', error);
    throw error;
  }

  return data?.map(row => row.book_data || row) ?? [];
}

export async function deleteBook(bookId: string) {
  if (!bookId) {
    throw new Error('ID du livre non fourni');
  }

  const { error } = await supabase
    .from('books')
    .delete()
    .match({ id: bookId });

  if (error) {
    console.error('Erreur Supabase:', error);
    throw new Error(`Erreur lors de la suppression : ${error.message}`);
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
