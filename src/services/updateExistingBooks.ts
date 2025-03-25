
import { Book } from '@/types/book';
import { supabase } from '@/integrations/supabase/client';
import { loadBooks } from '@/services/supabaseBooks';
import { getAmazonAffiliateUrl } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export async function updateAmazonLinksInLibrary() {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error when updating Amazon links:', authError);
      return { success: false, message: 'Vous devez être connecté pour effectuer cette action' };
    }
    
    console.log('Updating Amazon links for all books...');
    
    // Charger tous les livres de la bibliothèque
    const books = await loadBooks();
    if (!books || books.length === 0) {
      return { success: true, message: 'Aucun livre à mettre à jour' };
    }
    
    console.log(`Found ${books.length} books to update`);
    
    // Pour chaque livre, mettre à jour son lien Amazon
    const updatedBooks = books.map(book => {
      // Générer le lien Amazon correct
      const amazonUrl = getAmazonAffiliateUrl(book);
      return { ...book, amazonUrl };
    });
    
    // Sauvegarder les livres mis à jour dans la base de données
    const updatePromises = updatedBooks.map(async (book) => {
      const { error } = await supabase
        .from('books')
        .update({
          book_data: book
        })
        .eq('id', book.id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error(`Error updating book ${book.id}:`, error);
        return false;
      }
      return true;
    });
    
    const results = await Promise.all(updatePromises);
    const successCount = results.filter(Boolean).length;
    
    console.log(`Successfully updated ${successCount} out of ${books.length} books`);
    
    return { 
      success: true, 
      message: `${successCount} livres ont été mis à jour avec des liens Amazon corrects`,
      updated: successCount,
      total: books.length
    };
  } catch (error) {
    console.error('Error updating Amazon links:', error);
    return { 
      success: false, 
      message: 'Une erreur est survenue lors de la mise à jour des liens Amazon'
    };
  }
}

// Hook pour déclencher la mise à jour des liens Amazon
export function useUpdateAmazonLinks() {
  const { toast } = useToast();
  
  const updateLinks = async () => {
    try {
      const result = await updateAmazonLinksInLibrary();
      
      if (result.success) {
        toast({
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          description: result.message || "Une erreur est survenue",
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error in updateLinks:', error);
      toast({
        variant: "destructive",
        description: "Une erreur est survenue lors de la mise à jour des liens",
      });
      return { success: false, message: 'Erreur interne' };
    }
  };
  
  return { updateLinks };
}
