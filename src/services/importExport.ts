
import { supabase } from "@/integrations/supabase/client";
import { Book } from '@/types/book';
import { castQueryResult, castSingleResult } from "@/lib/supabase-helpers";

// Type for export data
interface ExportData {
  version: string;
  timestamp: string;
  userId: string;
  email: string | null;
  books: Book[];
}

// Type for import/export results
interface ImportExportResult {
  success: boolean;
  data?: ExportData;
  error?: string;
  message?: string;
  imported?: number;
}

/**
 * Exports the user's library to JSON format
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
    
    // Retrieve all user's books
    const result = await supabase
      .from('books')
      .select('book_data, status, completion_date')
      .eq('user_id', user.id);
    
    const data = castQueryResult<{
      book_data: any;
      status: string | null;
      completion_date: string | null;
    }>(result);
    
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
    
    // Format data for export
    const exportData: ExportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      userId: user.id,
      email: user.email,
      books: data.map(book => {
        // Ensure all book data is included
        const bookData = book.book_data as Book;
        return {
          ...bookData,
          status: book.status as Book['status'] || bookData?.status || 'to-read',
          completionDate: book.completion_date || bookData?.completionDate
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
 * Imports a library from JSON format
 */
export const importLibrary = async (data: any): Promise<ImportExportResult> => {
  try {
    // Verify data is properly formatted
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
    
    // Counter for successfully imported books
    let importedCount = 0;
    
    // Process all books to import
    for (const book of data.books) {
      // Check if the book already exists for this user
      const result = await supabase
        .from('books')
        .select('id')
        .eq('user_id', user.id)
        .eq('id', book.id)
        .maybeSingle();
        
      const existingBook = castSingleResult<{ id: string }>(result);
      
      // Prepare book data for insertion/update
      const bookData = {
        user_id: user.id,
        id: book.id,
        book_data: book,
        status: book.status || 'to-read',
        completion_date: book.completionDate
      };
      
      if (existingBook) {
        // Update existing book
        const { error: updateError } = await supabase
          .from('books')
          .update(bookData as any)
          .eq('user_id', user.id)
          .eq('id', book.id);
          
        if (updateError) {
          console.error('Erreur lors de la mise à jour du livre:', updateError);
          continue; // Continue to the next book
        }
      } else {
        // Insert a new book
        const { error: insertError } = await supabase
          .from('books')
          .insert(bookData as any);
          
        if (insertError) {
          console.error('Erreur lors de l\'insertion du livre:', insertError);
          continue; // Continue to the next book
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
