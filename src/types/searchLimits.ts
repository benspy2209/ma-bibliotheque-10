
import { Json } from '@/integrations/supabase/types';

export interface SearchLimitResponse {
  can_search?: boolean;
  success?: boolean;
  remaining: number;
  message: string;
  limit?: number;
  count?: number;
}

// Type guard pour vérifier si un objet est de type SearchLimitResponse
export function isSearchLimitResponse(obj: Json): obj is SearchLimitResponse {
  return (
    typeof obj === 'object' && 
    obj !== null && 
    ('remaining' in obj || 'can_search' in obj || 'success' in obj)
  );
}
