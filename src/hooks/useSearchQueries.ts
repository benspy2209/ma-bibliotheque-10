
import { useQueries } from '@tanstack/react-query';
import { searchBooks } from '@/services/openLibrary';
import { searchGoogleBooks, searchByISBN } from '@/services/googleBooks';
import { Book } from '@/types/book';
import { useIsMobile } from './use-mobile';

export function useSearchQueries(isbnQuery: string, debouncedQuery: string) {
  const isMobile = useIsMobile();
  
  type SearchQuery = {
    queryKey: readonly string[];
    queryFn: () => Promise<Book[]>;
    enabled: boolean;
    retry: boolean | number;
    retryDelay: (attempt: number) => number;
    staleTime: number;
    keepPreviousData: boolean;
  };

  const getQueries = (): SearchQuery[] => {
    // Configuration commune pour améliorer la fiabilité
    const queryConfig = {
      retry: isMobile ? 1 : 2,  // Moins de tentatives sur mobile
      retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      keepPreviousData: true
    };
    
    if (isbnQuery) {
      return [{
        queryKey: ['isbn', isbnQuery] as const,
        queryFn: () => searchByISBN(isbnQuery),
        enabled: isbnQuery.length === 10 || isbnQuery.length === 13,
        ...queryConfig
      }];
    }

    // Réduire le nombre de requêtes simultanées sur mobile
    if (isMobile) {
      return [
        {
          queryKey: ['googleBooks', debouncedQuery] as const,
          queryFn: () => searchGoogleBooks(debouncedQuery),
          enabled: debouncedQuery.length > 0,
          ...queryConfig
        }
      ];
    }

    return [
      {
        queryKey: ['openLibrary', debouncedQuery] as const,
        queryFn: () => searchBooks(debouncedQuery),
        enabled: debouncedQuery.length > 0,
        ...queryConfig
      },
      {
        queryKey: ['googleBooks', debouncedQuery] as const,
        queryFn: () => searchGoogleBooks(debouncedQuery),
        enabled: debouncedQuery.length > 0,
        ...queryConfig
      }
    ];
  };

  return useQueries({
    queries: getQueries()
  });
}
