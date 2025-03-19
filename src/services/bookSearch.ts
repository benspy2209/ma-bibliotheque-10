
import { Book } from '@/types/book';
import { searchGoogleBooks } from './googleBooks';
import { searchBnfBooks } from './bnfBooks';
import { searchOpenLibrary } from './openLibrary';
import { getCachedSearch, cacheSearchResults } from './searchCache';
import { removeDuplicateBooks } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast";

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures
const MIN_RESULTS = 5;

export async function searchBooks(query: string, options = { forceRefresh: false }): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    // 1. Vérifier le cache d'abord, sauf si forceRefresh est activé
    if (!options.forceRefresh) {
      const cachedResults = await getCachedSearch(query);
      if (cachedResults && cachedResults.length >= MIN_RESULTS) {
        console.log(`Résultats trouvés dans le cache (${cachedResults.length} livres)`);
        return cachedResults;
      }
    } else {
      console.log("Recherche forcée: ignorer le cache");
    }

    // 2. Si pas dans le cache ou pas assez de résultats, lancer une recherche complète
    console.log("Lancement d'une recherche complète sur toutes les sources");
    let results: Book[] = [];
    let errors = [];

    // 2a. Recherche Google Books (source principale)
    try {
      console.log('Recherche via Google Books...');
      const googleResults = await searchGoogleBooks(query);
      results = [...googleResults];
      console.log(`Google Books: ${googleResults.length} résultats`);
    } catch (error) {
      console.error('Erreur Google Books:', error);
      errors.push('Google Books');
    }

    // 2b. Recherche BnF (toujours effectuée pour enrichir les résultats)
    try {
      console.log('Enrichissement avec BnF...');
      const bnfResults = await searchBnfBooks(query);
      results = removeDuplicateBooks([...results, ...bnfResults]);
      console.log(`BnF: ${bnfResults.length} résultats ajoutés, total: ${results.length}`);
    } catch (error) {
      console.error('Erreur BnF:', error);
      errors.push('BnF');
    }

    // 2c. Recherche OpenLibrary (toujours effectuée pour compléter)
    try {
      console.log('Recherche complémentaire via OpenLibrary...');
      const openLibraryResults = await searchOpenLibrary(query);
      results = removeDuplicateBooks([...results, ...openLibraryResults]);
      console.log(`OpenLibrary: ${openLibraryResults.length} résultats ajoutés, total: ${results.length}`);
    } catch (error) {
      console.error('Erreur OpenLibrary:', error);
      errors.push('OpenLibrary');
    }

    // 3. Mettre en cache seulement si nous avons suffisamment de résultats
    if (results.length >= MIN_RESULTS) {
      await cacheSearchResults(query, results, MIN_RESULTS);
      console.log(`${results.length} résultats mis en cache (minimum requis: ${MIN_RESULTS})`);
    } else {
      console.log(`Résultats insuffisants (${results.length}) pour mise en cache (minimum: ${MIN_RESULTS})`);
    }

    return results;
  } catch (error) {
    console.error('Erreur générale lors de la recherche:', error);
    return [];
  }
}
