
import { Book } from '@/types/book';
import { searchGoogleBooks } from './googleBooks';
import { searchBnfBooks } from './bnfBooks';
import { searchOpenLibrary } from './openLibrary';
import { getCachedSearch, cacheSearchResults } from './searchCache';
import { removeDuplicateBooks } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast";

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures
const MIN_RESULTS = 5;

export async function searchBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    // 1. Vérifier le cache d'abord
    const cachedResults = await getCachedSearch(query);
    if (cachedResults && cachedResults.length > 0) {
      console.log('Résultats trouvés dans le cache');
      return cachedResults;
    }

    let results: Book[] = [];
    let errors = [];

    // 2. Recherche Google Books
    try {
      console.log('Recherche via Google Books...');
      const googleResults = await searchGoogleBooks(query);
      results = [...googleResults];
      console.log(`Google Books: ${googleResults.length} résultats`);
    } catch (error) {
      console.error('Erreur Google Books:', error);
      errors.push('Google Books');
    }

    // 3. Si peu de résultats, enrichir avec BnF
    if (results.length < MIN_RESULTS) {
      try {
        console.log('Enrichissement avec BnF...');
        const bnfResults = await searchBnfBooks(query);
        results = removeDuplicateBooks([...results, ...bnfResults]);
        console.log(`BnF: ${bnfResults.length} résultats ajoutés`);
      } catch (error) {
        console.error('Erreur BnF:', error);
        errors.push('BnF');
      }
    }

    // 4. Si toujours peu de résultats, compléter avec OpenLibrary
    if (results.length < MIN_RESULTS) {
      try {
        console.log('Recherche complémentaire via OpenLibrary...');
        const openLibraryResults = await searchOpenLibrary(query);
        results = removeDuplicateBooks([...results, ...openLibraryResults]);
        console.log(`OpenLibrary: ${openLibraryResults.length} résultats ajoutés`);
      } catch (error) {
        console.error('Erreur OpenLibrary:', error);
        errors.push('OpenLibrary');
      }
    }

    // 5. Mettre en cache si nous avons des résultats
    if (results.length > 0) {
      await cacheSearchResults(query, results);
      console.log(`${results.length} résultats mis en cache`);
    }

    return results;
  } catch (error) {
    console.error('Erreur générale lors de la recherche:', error);
    return [];
  }
}
