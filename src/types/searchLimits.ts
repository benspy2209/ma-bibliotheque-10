
import { Json } from '@/integrations/supabase/types';

export interface SearchLimitResponse {
  can_search?: boolean;
  success?: boolean;
  remaining: number;
  message: string;
  limit?: number;
  count?: number;
}

// Type guard to check if an object is of type SearchLimitResponse
export function isSearchLimitResponse(obj: Json): obj is SearchLimitResponse {
  return (
    typeof obj === 'object' && 
    obj !== null && 
    // Check for common properties without assuming the entire structure
    'remaining' in obj && 
    typeof obj.remaining === 'number' &&
    'message' in obj && 
    typeof obj.message === 'string'
  );
}
