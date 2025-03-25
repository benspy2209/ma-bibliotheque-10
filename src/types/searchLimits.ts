
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
export function isSearchLimitResponse(obj: Json): obj is SearchLimitResponse & Json {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  
  // Check for required properties
  if (!('remaining' in obj) || typeof obj.remaining !== 'number') {
    return false;
  }
  
  if (!('message' in obj) || typeof obj.message !== 'string') {
    return false;
  }
  
  // Optional properties should be of the correct type if present
  if ('can_search' in obj && typeof obj.can_search !== 'boolean') {
    return false;
  }
  
  if ('success' in obj && typeof obj.success !== 'boolean') {
    return false;
  }
  
  if ('limit' in obj && typeof obj.limit !== 'number') {
    return false;
  }
  
  if ('count' in obj && typeof obj.count !== 'number') {
    return false;
  }
  
  return true;
}
