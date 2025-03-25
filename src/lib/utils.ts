
// Re-export all utility functions from their respective modules
// This maintains backward compatibility so existing imports don't break

export { cn, normalizeString } from './core-utils';
export { AMAZON_AFFILIATE_ID, getAmazonAffiliateUrl } from './amazon-utils';
export { 
  filterNonBookResults, 
  isAuthorMatch 
} from './book-filters';
export { 
  removeDuplicateBooks, 
  isDuplicateBook 
} from './duplicates-utils';
