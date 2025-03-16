
import { useQueries } from '@tanstack/react-query';
import { searchFrenchBooks, searchByISBN } from '@/services/googleBooks';
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
        enabled: isbnQuery.length > 0
      }];
    }

    return [
      {
        queryKey: ['livres_francais', debouncedQuery] as const,
        queryFn: () => searchFrenchBooks(debouncedQuery),
        enabled: debouncedQuery.length > 0
      }
    ];
  };

  return useQueries({
    queries: getQueries()
  });
}
