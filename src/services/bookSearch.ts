
import { Book } from '@/types/book';
import { removeDuplicateBooks } from '@/lib/utils';

export type SearchType = 'author' | 'title' | 'general';

// Placeholder pour la future implémentation ISBNDB
export async function searchIsbndb(query: string, searchType: SearchType = 'author'): Promise<Book[]> {
  // Cette fonction sera implémentée plus tard avec l'API ISBNDB
  console.log(`Requête ISBNDB (${searchType}): ${query}`);
  return [];
}

export async function searchAllBooks(query: string, searchType: SearchType = 'author'): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    // Temporairement, retourne un tableau vide jusqu'à ce que l'API ISBNDB soit implémentée
    const books = await searchIsbndb(query, searchType);
    
    // Suppression des doublons
    const uniqueBooks = removeDuplicateBooks(books);
    
    console.log(`Total des résultats: ${uniqueBooks.length} livres`);
    
    return uniqueBooks;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
}
