
import { User } from "@supabase/supabase-js";

export interface UsernameChangeResponse {
  can_change: boolean;
  last_change: string | null;
  next_allowed: string | null;
}

// Define the return type of the useUsername hook
export interface UsernameHookReturn {
  username: string | null;
  isLoading: boolean;
  canChangeUsername: boolean;
  isAdmin: boolean;
  updateUsername: (newUsername: string) => Promise<boolean>;
  fetchUsername: () => Promise<void>;
}
