
import { Book } from '@/types/book';
import { searchGoogleBooks } from './googleBooks';
import { searchBooks as searchOpenLibrary } from './openLibrary';
import { removeDuplicateBooks } from '@/lib/utils';

export type SearchType = 'author' | 'title' | 'general';

export async function searchAllBooks(query: string, searchType: SearchType = 'author'): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    // Lancer les deux recherches en parallèle
    const [googleResults, openLibraryResults] = await Promise.all([
      searchGoogleBooks(query, searchType),
      searchOpenLibrary(query, searchType)
    ]);

    // Combiner les résultats
    const allBooks = [...googleResults, ...openLibraryResults];
    
    // Supprimer les doublons (en se basant sur le titre et l'auteur)
    const uniqueBooks = removeDuplicateBooks(allBooks);
    
    console.log(`Total des résultats combinés en français: ${uniqueBooks.length} livres`);
    
    return uniqueBooks;
  } catch (error) {
    console.error('Erreur lors de la recherche combinée:', error);
    return [];
  }
}
