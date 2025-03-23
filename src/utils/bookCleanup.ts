
import { searchBooksByTitle, deleteBook } from '@/services/supabaseBooks';
import { useToast } from '@/hooks/use-toast';

/**
 * Fonction utilitaire pour supprimer un livre spécifique par titre et auteur
 */
export async function removeSpecificBook(title: string, author: string): Promise<{success: boolean, message: string}> {
  try {
    // Rechercher les livres correspondant au titre
    const matchingBooks = await searchBooksByTitle(title);
    
    // Si aucun livre trouvé
    if (matchingBooks.length === 0) {
      return { success: false, message: `Aucun livre trouvé avec le titre "${title}"` };
    }
    
    // Filtrer les livres par auteur (pour être sûr de supprimer le bon livre)
    const bookToDelete = matchingBooks.find(book => {
      if (Array.isArray(book.author)) {
        return book.author.some(a => a.toLowerCase().includes(author.toLowerCase()));
      } else {
        return book.author.toLowerCase().includes(author.toLowerCase());
      }
    });
    
    // Si aucun livre correspondant à l'auteur spécifié n'est trouvé
    if (!bookToDelete) {
      return { 
        success: false, 
        message: `Aucun livre trouvé avec le titre "${title}" et l'auteur "${author}"` 
      };
    }
    
    console.log("Livre à supprimer trouvé:", bookToDelete.id, bookToDelete.title);
    
    // Supprimer le livre
    await deleteBook(bookToDelete.id);
    
    return { 
      success: true, 
      message: `Le livre "${title}" de ${author} a été supprimé avec succès` 
    };
  } catch (error) {
    console.error("Erreur lors de la suppression du livre:", error);
    return { 
      success: false, 
      message: `Erreur lors de la suppression: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
    };
  }
}
