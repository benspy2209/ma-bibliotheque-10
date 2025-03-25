
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/types/book";
import { Json } from "@/types/supabase";

// Type pour les données d'exportation
interface ExportData {
  version: string;
  timestamp: string;
  userId: string;
  email: string | null;
  books: Book[];
}

// Type pour les résultats d'importation/exportation
interface ImportExportResult {
  success: boolean;
  data?: ExportData;
  error?: string;
  message?: string;
  imported?: number;
}

/**
 * Exporte la bibliothèque de l'utilisateur au format JSON
 */
export const exportLibrary = async (): Promise<ImportExportResult> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: 'Utilisateur non connecté'
      };
    }
    
    // Récupérer tous les livres de l'utilisateur
    const { data, error } = await supabase
      .from('user_books')
      .select('book_id, book_data, status, completion_date')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Erreur lors de la récupération des livres:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    // Vérifier si des livres ont été récupérés
    if (!data || data.length === 0) {
      console.log('Aucun livre trouvé pour l\'exportation');
      return {
        success: true,
        data: {
          version: '1.0',
          timestamp: new Date().toISOString(),
          userId: user.id,
          email: user.email,
          books: []
        }
      };
    }
    
    // Formatage des données pour l'export
    const exportData: ExportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      userId: user.id,
      email: user.email,
      books: data.map(book => {
        // S'assurer que toutes les données du livre sont incluses
        const bookData = book.book_data as Book;
        return {
          ...bookData,
          status: book.status as Book['status'] || bookData?.status || 'to-read',
          completion_date: book.completion_date || bookData?.completion_date
        };
      })
    };
    
    console.log(`Exportation de ${data.length} livres terminée avec succès.`);
    
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
};

/**
 * Importe une bibliothèque au format JSON
 */
export const importLibrary = async (data: any): Promise<ImportExportResult> => {
  try {
    // Vérifier que les données sont correctement formatées
    if (!data || !data.books || !Array.isArray(data.books)) {
      return {
        success: false,
        message: "Format de données invalide pour l'importation"
      };
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        message: "Utilisateur non connecté"
      };
    }
    
    // Compteur pour les livres importés avec succès
    let importedCount = 0;
    
    // Parcourir tous les livres à importer
    for (const book of data.books) {
      // Vérifier si le livre existe déjà pour cet utilisateur
      const { data: existingBook } = await supabase
        .from('user_books')
        .select('book_id')
        .eq('user_id', user.id)
        .eq('book_id', book.id)
        .maybeSingle();
        
      // Préparer les données du livre pour l'insertion/mise à jour
      const bookData = {
        user_id: user.id,
        book_id: book.id,
        book_data: book,
        status: book.status || 'to-read',
        completion_date: book.completion_date
      };
      
      if (existingBook) {
        // Mettre à jour le livre existant
        const { error: updateError } = await supabase
          .from('user_books')
          .update(bookData)
          .eq('user_id', user.id)
          .eq('book_id', book.id);
          
        if (updateError) {
          console.error('Erreur lors de la mise à jour du livre:', updateError);
          continue; // Passer au livre suivant
        }
      } else {
        // Insérer un nouveau livre
        const { error: insertError } = await supabase
          .from('user_books')
          .insert(bookData);
          
        if (insertError) {
          console.error('Erreur lors de l\'insertion du livre:', insertError);
          continue; // Passer au livre suivant
        }
      }
      
      importedCount++;
    }
    
    return {
      success: true,
      imported: importedCount,
      message: `${importedCount} livres ont été importés avec succès.`
    };
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erreur inconnue lors de l'importation"
    };
  }
};
