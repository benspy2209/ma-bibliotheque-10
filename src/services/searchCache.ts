
import { supabase } from './supabaseBooks';
import { Book } from '@/types/book';

export async function getCachedSearch(query: string): Promise<Book[] | null> {
  const { data, error } = await supabase
    .from('search_cache')
    .select('*')
    .eq('query', query)
    .single();

  if (error || !data) return null;
  return data.results;
}

export async function cacheSearchResults(query: string, results: Book[]): Promise<void> {
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
