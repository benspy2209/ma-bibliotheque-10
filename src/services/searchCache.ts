
import { supabase } from './supabaseBooks';
import { Book } from '@/types/book';

export async function getCachedSearch(query: string): Promise<Book[] | null> {
  // On ne retourne plus le cache immédiatement
  return null;
}

export async function cacheSearchResults(query: string, results: Book[]): Promise<void> {
  if (!results || results.length === 0) return;

  const { data: existingCache } = await supabase
    .from('search_cache')
    .select('results')
    .eq('query', query)
    .single();

  // Ne mettre en cache que si nous avons plus de résultats que précédemment
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
}
