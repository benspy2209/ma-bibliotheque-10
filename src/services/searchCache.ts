
import { supabase } from './supabaseBooks';
import { Book } from '@/types/book';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures

export async function getCachedSearch(query: string): Promise<Book[] | null> {
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
      return null;
    }

    return cache.results;
  } catch (error) {
    console.error('Erreur lors de la récupération du cache:', error);
    return null;
  }
}

export async function cacheSearchResults(query: string, results: Book[]): Promise<void> {
  if (!results || results.length === 0) return;

  try {
    const { data: existingCache } = await supabase
      .from('search_cache')
      .select('results')
      .eq('query', query)
      .single();

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
      }
    }
  } catch (error) {
    console.error('Erreur lors de la mise en cache:', error);
  }
}
