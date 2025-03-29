
import { supabase } from '@/integrations/supabase/client';
import { getAmazonAffiliateUrl } from '@/lib/amazon-utils';
import { AMAZON_AFFILIATE_ID } from '@/lib/amazon-utils';
import { useToast } from '@/hooks/use-toast';

/**
 * Met à jour tous les liens d'affiliation Amazon pour tous les livres de tous les utilisateurs
 * Cette fonction ne devrait être utilisée que par l'administrateur
 */
export async function updateAllAmazonLinks() {
  try {
    // Vérifier que l'utilisateur est administrateur
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user || user.email !== 'debruijneb@gmail.com') {
      console.error('Accès non autorisé lors de la mise à jour des liens Amazon');
      return { 
        success: false, 
        message: 'Accès non autorisé. Seul l\'administrateur peut effectuer cette action.'
      };
    }
    
    console.log('Démarrage de la mise à jour globale des liens Amazon...');
    
    // Récupérer tous les livres de la base de données
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('id, user_id, book_data');
      
    if (booksError || !books) {
      console.error('Erreur lors de la récupération des livres:', booksError);
      return { 
        success: false, 
        message: 'Erreur lors de la récupération des livres de la base de données'
      };
    }
    
    console.log(`${books.length} livres trouvés, mise à jour des liens Amazon...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Mettre à jour chaque livre
    for (const book of books) {
      try {
        // Extraire et mettre à jour les données du livre
        const bookData = book.book_data;
        
        // Si le livre a un amazonUrl, le mettre à jour
        if (bookData) {
          // Générer un nouveau lien Amazon
          const newAmazonUrl = getAmazonAffiliateUrl(bookData);
          
          // Ne mettre à jour que si le lien est différent ou n'existe pas
          if (!bookData.amazonUrl || !bookData.amazonUrl.includes(AMAZON_AFFILIATE_ID)) {
            bookData.amazonUrl = newAmazonUrl;
            
            // Sauvegarder les modifications dans la base de données
            const { error: updateError } = await supabase
              .from('books')
              .update({ 
                book_data: bookData 
              })
              .eq('id', book.id);
              
            if (updateError) {
              console.error(`Erreur lors de la mise à jour du livre ${book.id}:`, updateError);
              errorCount++;
            } else {
              successCount++;
            }
          }
        }
      } catch (error) {
        console.error(`Erreur lors du traitement du livre ${book.id}:`, error);
        errorCount++;
      }
    }
    
    console.log(`Mise à jour terminée. ${successCount} livres mis à jour, ${errorCount} erreurs.`);
    
    // Ajouter un log système si la fonction existe
    try {
      await supabase.rpc('add_system_log', {
        p_level: 'success',
        p_message: `Mise à jour globale des liens Amazon: ${successCount} livres mis à jour, ${errorCount} erreurs`,
        p_user_id: user.id,
        p_path: '/profile/settings'
      });
    } catch (error) {
      // Si la fonction n'existe pas, ignorer l'erreur
      console.log('Note: Impossible d\'ajouter un log système (la fonction n\'existe peut-être pas)');
    }
    
    return { 
      success: true, 
      message: `${successCount} livres ont été mis à jour avec des liens d'affiliation Amazon corrects. ${errorCount} erreurs.`,
      updated: successCount,
      errors: errorCount,
      total: books.length
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour globale des liens Amazon:', error);
    return { 
      success: false, 
      message: 'Une erreur est survenue lors de la mise à jour des liens Amazon'
    };
  }
}

/**
 * Hook pour déclencher la mise à jour des liens Amazon pour tous les utilisateurs
 */
export function useUpdateAllAmazonLinks() {
  const { toast } = useToast();
  
  const updateAllLinks = async () => {
    try {
      toast({
        description: "Mise à jour des liens Amazon en cours...",
      });
      
      const result = await updateAllAmazonLinks();
      
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
      console.error('Error in updateAllLinks:', error);
      toast({
        variant: "destructive",
        description: "Une erreur est survenue lors de la mise à jour globale des liens",
      });
      return { success: false, message: 'Erreur interne' };
    }
  };
  
  return { updateAllLinks };
}
