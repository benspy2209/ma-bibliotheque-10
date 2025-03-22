
/**
 * Types spécifiques pour les tables Supabase
 * Ces types complètent ceux générés automatiquement
 */

export type BookRow = {
  id: string;
  book_data: any;
  user_id: string;
  created_at: string;
  status: string | null;
  completion_date: string | null;
}
