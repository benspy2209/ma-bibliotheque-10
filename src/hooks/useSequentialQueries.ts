
import { useQueries } from '@tanstack/react-query';
import { searchBooks } from '@/services/openLibrary';
import { searchGoogleBooks } from '@/services/googleBooks';
import { Book } from '@/types/book';

export function useSequentialQueries(debouncedQuery: string) {
  return useQueries({
    queries: [
      {
        queryKey: ['openLibrary', debouncedQuery],
        queryFn: () => searchBooks(debouncedQuery),
        enabled: debouncedQuery.length > 0
      },
      {
        queryKey: ['googleBooks', debouncedQuery],
        queryFn: async ({ queryClient }) => {
          const openLibraryData = queryClient.getQueryData<Book[]>(['openLibrary', debouncedQuery]);
          if (openLibraryData && openLibraryData.length > 0) {
            return [];
          }
          return searchGoogleBooks(debouncedQuery);
        },
        enabled: debouncedQuery.length > 0
      }
    ]
  });
}
