
import { supabase } from './supabaseBooks';
import { Book } from '@/types/book';

const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

export async function getCachedSearch(query: string): Promise<Book[] | null> {
  const { data, error } = await supabase
    .from('search_cache')
    .select('*')
    .eq('query', query)
    .single();

  if (error || !data) return null;

  // Vérifier si le cache est expiré
  const createdAt = new Date(data.created_at).getTime();
  const now = new Date().getTime();
  if (now - createdAt > CACHE_EXPIRATION) {
    // Supprimer l'entrée expirée
    await supabase
      .from('search_cache')
      .delete()
      .eq('query', query);
    return null;
  }

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
