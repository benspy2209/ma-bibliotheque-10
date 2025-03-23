
import { Book } from '@/types/book';
import { supabase } from '@/integrations/supabase/client';
import { saveBook } from './supabaseBooks';
import { v4 as uuidv4 } from 'uuid';

/**
 * Exporte la bibliothèque de l'utilisateur actuel au format JSON
 */
export async function exportLibrary(): Promise<{success: boolean, data?: any, error?: string}> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Erreur d\'authentification:', authError);
      return { 
        success: false, 
        error: 'Vous devez être connecté pour exporter votre bibliothèque'
      };
    }
    
    // Récupération de tous les livres de l'utilisateur
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Erreur lors de l\'exportation:', error);
      return { 
        success: false, 
        error: `Erreur lors de l'exportation: ${error.message}` 
      };
    }
    
    // Formatage des données pour l'export
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      userId: user.id,
      email: user.email,
      books: data
    };
    
    return { 
      success: true, 
      data: exportData 
    };
  } catch (error) {
    console.error('Erreur lors de l\'exportation:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'exportation' 
    };
  }
}

/**
 * Importe une bibliothèque depuis un fichier JSON
 */
export async function importLibrary(
  importData: any
): Promise<{success: boolean, imported: number, errors: number, message?: string}> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Erreur d\'authentification:', authError);
      return { 
        success: false, 
        imported: 0, 
        errors: 0, 
        message: 'Vous devez être connecté pour importer une bibliothèque'
      };
    }
    
    console.log('Structure des données importées:', JSON.stringify(importData, null, 2));
    
    // Détection du format des données
    let booksToImport: any[] = [];
    
    // Format 1: { books: [...] }
    if (importData.books && Array.isArray(importData.books)) {
      booksToImport = importData.books;
    } 
    // Format 2: [...] (tableau direct de livres)
    else if (Array.isArray(importData)) {
      booksToImport = importData;
    }
    // Format 3: Tenter de trouver des données imbriquées
    else {
      for (const key in importData) {
        if (importData[key] && Array.isArray(importData[key])) {
          booksToImport = importData[key];
          break;
        }
      }
    }
    
    // Vérification finale que nous avons des livres à importer
    if (!booksToImport.length) {
      console.error('Aucun livre trouvé dans les données importées');
      return {
        success: false,
        imported: 0,
        errors: 0,
        message: 'Format de données invalide: aucun livre trouvé'
      };
    }
    
    console.log(`${booksToImport.length} livres trouvés dans les données importées`);
    
    // Statistiques d'importation
    let imported = 0;
    let errors = 0;
    
    // Pour chaque livre dans le fichier d'import
    for (const bookItem of booksToImport) {
      try {
        // Trouver les données du livre selon différents formats possibles
        let bookData = bookItem;
        
        // Format où les données du livre sont dans book_data
        if (bookItem.book_data) {
          bookData = bookItem.book_data;
        }
        
        // Format de la base de données Supabase directe
        if (bookItem.id && typeof bookItem.id === 'string' && bookItem.user_id) {
          // Construction du livre avec un nouvel ID
          const book: Book = {
            id: uuidv4(), // Nouvel ID pour éviter les conflits
            title: bookData.title || 'Titre inconnu',
            author: bookData.author || 'Auteur inconnu',
            language: Array.isArray(bookData.language) ? bookData.language : ['unknown'],
            status: bookItem.status || bookData.status || 'to-read',
            completionDate: bookItem.completion_date || bookData.completionDate
          };
          
          // Copie des propriétés optionnelles si elles existent
          if (bookData.sourceId) book.sourceId = bookData.sourceId;
          if (bookData.cover) book.cover = bookData.cover;
          if (bookData.rating) book.rating = bookData.rating;
          if (bookData.purchased !== undefined) book.purchased = bookData.purchased;
          if (bookData.numberOfPages) book.numberOfPages = bookData.numberOfPages;
          if (bookData.publishDate) book.publishDate = bookData.publishDate;
          if (bookData.series) book.series = bookData.series;
          if (bookData.description) book.description = bookData.description;
          if (bookData.publishers) book.publishers = bookData.publishers;
          if (bookData.subjects) book.subjects = bookData.subjects;
          if (bookData.isbn) book.isbn = bookData.isbn;
          if (bookData.readingTimeDays) book.readingTimeDays = bookData.readingTimeDays;
          if (bookData.review) book.review = bookData.review;
          
          // Sauvegarde du livre dans la base de données
          const result = await saveBook(book);
          
          if (result.success) {
            imported++;
          } else {
            if (result.error !== 'duplicate') {
              errors++;
              console.error('Erreur lors de l\'importation du livre:', result.message);
            }
          }
        } else {
          // Format de livre simple (potentiellement sans ID)
          const book: Book = {
            id: uuidv4(),
            title: bookData.title || 'Titre inconnu',
            author: bookData.author || 'Auteur inconnu',
            language: Array.isArray(bookData.language) ? bookData.language : ['unknown'],
            status: bookItem.status || bookData.status || 'to-read',
            completionDate: bookItem.completion_date || bookData.completionDate
          };
          
          // Copie des propriétés optionnelles si elles existent
          if (bookData.sourceId) book.sourceId = bookData.sourceId;
          if (bookData.cover) book.cover = bookData.cover;
          if (bookData.rating) book.rating = bookData.rating;
          if (bookData.purchased !== undefined) book.purchased = bookData.purchased;
          if (bookData.numberOfPages) book.numberOfPages = bookData.numberOfPages;
          if (bookData.publishDate) book.publishDate = bookData.publishDate;
          if (bookData.series) book.series = bookData.series;
          if (bookData.description) book.description = bookData.description;
          if (bookData.publishers) book.publishers = bookData.publishers;
          if (bookData.subjects) book.subjects = bookData.subjects;
          if (bookData.isbn) book.isbn = bookData.isbn;
          if (bookData.readingTimeDays) book.readingTimeDays = bookData.readingTimeDays;
          if (bookData.review) book.review = bookData.review;
          
          // Sauvegarde du livre dans la base de données
          const result = await saveBook(book);
          
          if (result.success) {
            imported++;
          } else {
            if (result.error !== 'duplicate') {
              errors++;
              console.error('Erreur lors de l\'importation du livre:', result.message);
            }
          }
        }
      } catch (error) {
        errors++;
        console.error('Erreur lors du traitement d\'un livre:', error);
      }
    }
    
    return {
      success: true,
      imported,
      errors,
      message: `Importation terminée: ${imported} livres importés, ${errors} erreurs`
    };
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    return {
      success: false,
      imported: 0,
      errors: 0,
      message: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'importation'
    };
  }
}
