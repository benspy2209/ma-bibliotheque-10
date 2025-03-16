
import { useQueries } from '@tanstack/react-query';
import { searchBooks } from '@/services/openLibrary';
import { searchGoogleBooks, searchByISBN } from '@/services/googleBooks';
import { Book } from '@/types/book';

export function useSearchQueries(isbnQuery: string, debouncedQuery: string) {
  type SearchQuery = {
    queryKey: readonly string[];
    queryFn: () => Promise<Book[]>;
    enabled: boolean;
  };

  const getQueries = (): SearchQuery[] => {
    if (isbnQuery) {
      return [{
        queryKey: ['isbn', isbnQuery] as const,
        queryFn: () => searchByISBN(isbnQuery),
        enabled: isbnQuery.length === 10 || isbnQuery.length === 13
      }];
    }

    return [
      {
        queryKey: ['openLibrary', debouncedQuery] as const,
        queryFn: () => searchBooks(debouncedQuery),
        enabled: debouncedQuery.length > 0
      },
      {
        queryKey: ['googleBooks', debouncedQuery] as const,
        queryFn: () => searchGoogleBooks(debouncedQuery),
        enabled: debouncedQuery.length > 0
      }
    ];
  };

  return useQueries({
    queries: getQueries()
  });
}
