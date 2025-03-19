
import { supabase } from './supabaseBooks';
import { Book } from '@/types/book';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures

export async function getCachedSearch(query: string, forceRefresh = false): Promise<Book[] | null> {
  if (forceRefresh) {
    console.log("Forçage d'une nouvelle recherche, ignorant le cache");
    return null;
  }
  
  try {
    const { data: cache } = await supabase
      .from('search_cache')
      .select('*')
      .eq('query', query)
      .single();

    if (!cache) return null;

    const cacheAge = Date.now() - new Date(cache.created_at).getTime();
    if (cacheAge > CACHE_DURATION) {
      // Cache expiré, on le supprime
      await supabase
        .from('search_cache')
        .delete()
        .eq('query', query);
      console.log("Cache expiré, suppression effectuée");
      return null;
    }

    console.log(`Cache trouvé avec ${cache.results.length} résultats`);
    return cache.results;
  } catch (error) {
    console.error('Erreur lors de la récupération du cache:', error);
    return null;
  }
}

export async function cacheSearchResults(query: string, results: Book[], minResultsRequired = 5): Promise<void> {
  if (!results || results.length === 0) return;

  // Ne mettre en cache que si nous avons suffisamment de résultats pertinents
  if (results.length < minResultsRequired) {
    console.log(`Pas assez de résultats (${results.length}/${minResultsRequired}) pour mettre en cache`);
    return;
  }

  try {
    const { data: existingCache } = await supabase
      .from('search_cache')
      .select('results')
      .eq('query', query)
      .single();

    // Mettre à jour le cache seulement si nous avons plus ou de meilleurs résultats
    if (!existingCache || results.length > existingCache.results.length) {
      const { error } = await supabase
        .from('search_cache')
        .upsert({ 
          query,
          results,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erreur lors de la mise en cache:', error);
      } else {
        console.log(`${results.length} résultats mis en cache avec succès`);
      }
    } else {
      console.log('Cache existant conservé car il contient déjà plus de résultats');
    }
  } catch (error) {
    console.error('Erreur lors de la mise en cache:', error);
  }
}

export async function invalidateCache(query?: string): Promise<void> {
  try {
    let deleteQuery = supabase.from('search_cache').delete();
    
    if (query) {
      console.log(`Invalidation du cache pour la recherche: "${query}"`);
      deleteQuery = deleteQuery.eq('query', query);
    } else {
      console.log('Invalidation de tout le cache de recherche');
    }
    
    const { error } = await deleteQuery;
    
    if (error) {
      console.error("Erreur lors de l'invalidation du cache:", error);
    }
  } catch (error) {
    console.error("Erreur lors de l'invalidation du cache:", error);
  }
}
