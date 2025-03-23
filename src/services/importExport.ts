
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
    
    // Vérification de la validité des données importées
    if (!importData || !importData.books || !Array.isArray(importData.books)) {
      return {
        success: false,
        imported: 0,
        errors: 0,
        message: 'Format de données invalide'
      };
    }
    
    // Statistiques d'importation
    let imported = 0;
    let errors = 0;
    
    // Pour chaque livre dans le fichier d'import
    for (const bookRow of importData.books) {
      try {
        // Récupération des données du livre
        const bookData = bookRow.book_data || {};
        
        // Construction du livre avec un nouvel ID
        const book: Book = {
          ...bookData,
          id: uuidv4(), // Nouvel ID pour éviter les conflits
          status: bookRow.status || bookData.status || 'to-read',
          completionDate: bookRow.completion_date || bookData.completionDate
        };
        
        // Sauvegarde du livre dans la base de données
        const result = await saveBook(book);
        
        if (result.success) {
          imported++;
        } else {
          // Si le livre est déjà présent, on ne compte pas comme une erreur
          if (result.error !== 'duplicate') {
            errors++;
            console.error('Erreur lors de l\'importation du livre:', result.message);
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
