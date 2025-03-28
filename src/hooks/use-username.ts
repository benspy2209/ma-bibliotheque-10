
// Re-export the hook from the implementation file
export { useUsernameHook as useUsername } from './username/use-username-hook';
export type { UsernameHookReturn } from './username/username-types';

// Export custom RPC types to maintain backward compatibility
export type CustomRPC = 
  | "can_change_username" 
  | "can_perform_search" 
  | "fetch_reading_goals" 
  | "get_all_users_statistics" 
  | "get_reading_streak" 
  | "increment_search_count" 
  | "upsert_reading_goals"
  | "admin_update_username";

// This helps TypeScript recognize our custom RPC function
// Extend the supabase client type to include our custom RPC
declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    rpc<T = any>(fn: CustomRPC, params?: object): { data: T; error: Error };
  }
}
