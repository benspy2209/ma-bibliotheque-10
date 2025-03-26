
import { PostgrestError } from '@supabase/supabase-js';
import { BookRow } from '@/types/supabase';

/**
 * Helper function to safely cast database results to specific types
 * and handle potential errors in a type-safe manner
 */
export const castQueryResult = <T>(result: { data: any | null, error: PostgrestError | null }): T[] | null => {
  if (result.error) {
    console.error('Database error:', result.error);
    return null;
  }
  
  return result.data as T[];
};

/**
 * Helper to safely cast a single result
 */
export const castSingleResult = <T>(result: { data: any | null, error: PostgrestError | null }): T | null => {
  if (result.error) {
    console.error('Database error:', result.error);
    return null;
  }
  
  return result.data as T;
};

/**
 * Type-safe utility to handle book data
 */
export const processBookRow = (row: any): BookRow => {
  // Ensure we're dealing with a proper row structure
  if (!row || !row.book_data) {
    console.error('Invalid book row:', row);
    return {
      id: '',
      book_data: {},
      user_id: '',
      created_at: new Date().toISOString(),
      status: null,
      completion_date: null
    };
  }
  
  return row as BookRow;
};

/**
 * Type predicate to check if an item is not null or undefined
 */
export function isDefined<T>(item: T | null | undefined): item is T {
  return item !== null && item !== undefined;
}
