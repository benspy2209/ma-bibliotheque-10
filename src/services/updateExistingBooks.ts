
import { Book } from '@/types/book';
import { supabase } from '@/integrations/supabase/client';
import { loadBooks } from '@/services/supabaseBooks';
import { getAmazonAffiliateUrl, isAmazonLinkValid } from '@/lib/amazon-utils';
import { useToast } from '@/hooks/use-toast';

/**
 * Cette fonction corrige les liens Amazon pour tous les livres dans la bibliothèque
 * Elle sera exécutée automatiquement lors du chargement de la bibliothèque
 */
export async function updateAmazonLinksInLibrary() {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error when updating Amazon links:', authError);
      return { success: false, message: 'Vous devez être connecté pour effectuer cette action' };
    }
    
    console.log('Vérification et mise à jour des liens Amazon pour tous les livres...');
    
    // Charger tous les livres de la bibliothèque
    const books = await loadBooks();
    if (!books || books.length === 0) {
      return { success: true, message: 'Aucun livre à mettre à jour' };
    }
    
    console.log(`${books.length} livres trouvés, vérification des liens Amazon...`);
    
    // Identifier les livres dont les liens Amazon sont incorrects
    const booksToUpdate = books.filter(book => !isAmazonLinkValid(book.amazonUrl));
    
    if (booksToUpdate.length === 0) {
      console.log('Tous les liens Amazon sont déjà corrects.');
      return { 
        success: true, 
        message: 'Tous les liens Amazon sont déjà à jour',
        updated: 0,
        total: books.length
      };
    }
    
    console.log(`${booksToUpdate.length} livres nécessitent une mise à jour des liens Amazon`);
    
    // Mettre à jour uniquement les livres avec des liens incorrects
    const updatedBooks = booksToUpdate.map(book => {
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
    
    console.log(`${successCount} livres mis à jour avec des liens Amazon corrects`);
    
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

/**
 * Hook pour déclencher la mise à jour des liens Amazon silencieusement
 * Cette fonction sera utilisée automatiquement lors du chargement de la bibliothèque
 */
export function useUpdateAmazonLinks() {
  const { toast } = useToast();
  
  const updateLinks = async (showToasts = false) => {
    try {
      const result = await updateAmazonLinksInLibrary();
      
      if (showToasts) {
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
      }
      
      return result;
    } catch (error) {
      console.error('Error in updateLinks:', error);
      if (showToasts) {
        toast({
          variant: "destructive",
          description: "Une erreur est survenue lors de la mise à jour des liens",
        });
      }
      return { success: false, message: 'Erreur interne' };
    }
  };
  
  return { updateLinks };
}
