import { searchBooksByTitle, deleteBook, loadBooks } from '@/services/supabaseBooks';

/**
 * Fonction utilitaire pour supprimer un livre spécifique par titre et auteur
 */
export async function removeSpecificBook(title: string, author: string): Promise<{success: boolean, message: string}> {
  try {
    // Chargeons tous les livres plutôt que d'utiliser searchBooksByTitle
    const allBooks = await loadBooks();
    console.log(`Recherche parmi ${allBooks.length} livres pour "${title}" de ${author}`);
    
    // Si aucun livre trouvé
    if (allBooks.length === 0) {
      return { success: false, message: `Aucun livre dans votre bibliothèque` };
    }
    
    // Filtrer les livres par titre et auteur avec des correspondances plus souples
    const matchingBooks = allBooks.filter(book => {
      const bookTitle = typeof book.title === 'string' ? book.title.toLowerCase() : '';
      const searchTitle = title.toLowerCase();
      
      // Vérifier si le titre du livre contient le titre recherché ou inversement
      const titleMatch = bookTitle.includes(searchTitle) || searchTitle.includes(bookTitle);
      
      // Vérifier l'auteur
      let authorMatch = false;
      if (Array.isArray(book.author)) {
        authorMatch = book.author.some(a => 
          a.toLowerCase().includes(author.toLowerCase()) || 
          author.toLowerCase().includes(a.toLowerCase())
        );
      } else if (typeof book.author === 'string') {
        authorMatch = book.author.toLowerCase().includes(author.toLowerCase()) || 
                     author.toLowerCase().includes(book.author.toLowerCase());
      }
      
      return titleMatch && authorMatch;
    });
    
    console.log(`Livres correspondants trouvés: ${matchingBooks.length}`);
    matchingBooks.forEach(book => {
      console.log(`- ID: ${book.id}, Titre: ${book.title}, Auteur: ${Array.isArray(book.author) ? book.author.join(', ') : book.author}`);
    });
    
    // Si aucun livre correspondant n'est trouvé
    if (matchingBooks.length === 0) {
      return { 
        success: false, 
        message: `Aucun livre trouvé avec le titre "${title}" et l'auteur "${author}"` 
      };
    }
    
    // Prendre le premier livre correspondant
    const bookToDelete = matchingBooks[0];
    console.log("Livre à supprimer trouvé:", bookToDelete.id, bookToDelete.title);
    
    // Supprimer le livre
    await deleteBook(bookToDelete.id);
    
    return { 
      success: true, 
      message: `Le livre "${bookToDelete.title}" de ${Array.isArray(bookToDelete.author) ? bookToDelete.author[0] : bookToDelete.author} a été supprimé avec succès` 
    };
  } catch (error) {
    console.error("Erreur lors de la suppression du livre:", error);
    return { 
      success: false, 
      message: `Erreur lors de la suppression: ${error instanceof Error ? error.message : "Erreur inconnue"}` 
    };
  }
}
