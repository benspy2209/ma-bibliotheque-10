
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

export type ReadingGoalRow = {
  id: string;
  user_id: string;
  yearly_goal: number;
  monthly_goal: number;
  created_at: string;
  updated_at: string;
}
