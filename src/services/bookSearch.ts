
import { Book } from '@/types/book';
import { searchGoogleBooks } from './googleBooks';
import { searchBnfBooks } from './bnfBooks';
import { searchOpenLibrary } from './openLibrary';
import { getCachedSearch, cacheSearchResults } from './searchCache';
import { removeDuplicateBooks } from '@/lib/utils';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures

export async function searchBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    // 1. Vérifier le cache d'abord
    const cachedResults = await getCachedSearch(query);
    if (cachedResults) {
      console.log('Résultats trouvés dans le cache');
      return cachedResults;
    }

    // 2. Recherche principale via Google Books
    console.log('Recherche via Google Books...');
    let results = await searchGoogleBooks(query);

    // 3. Si peu de résultats, enrichir avec BnF
    if (results.length < 5) {
      console.log('Enrichissement avec BnF...');
      const bnfResults = await searchBnfBooks(query);
      results = [...results, ...bnfResults];
    }

    // 4. Si toujours peu de résultats, compléter avec OpenLibrary
    if (results.length < 5) {
      console.log('Recherche complémentaire via OpenLibrary...');
      const openLibraryResults = await searchOpenLibrary(query);
      results = [...results, ...openLibraryResults];
    }

    // Dédupliquer et nettoyer les résultats
    const finalResults = removeDuplicateBooks(results);

    // Mettre en cache les résultats
    await cacheSearchResults(query, finalResults);

    return finalResults;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
}
