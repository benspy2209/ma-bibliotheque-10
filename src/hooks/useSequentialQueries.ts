
import { useQueries, QueryFunction, QueryFunctionContext } from '@tanstack/react-query';
import { searchBooks } from '@/services/openLibrary';
import { searchGoogleBooks } from '@/services/googleBooks';
import { Book } from '@/types/book';

export function useSequentialQueries(debouncedQuery: string) {
  return useQueries({
    queries: [
      {
        queryKey: ['openLibrary', debouncedQuery],
        queryFn: () => searchBooks(debouncedQuery) as Promise<Book[]>,
        enabled: debouncedQuery.length > 0
      },
      {
        queryKey: ['googleBooks', debouncedQuery],
        queryFn: (context: QueryFunctionContext) => {
          // Access queryClient from context
          const openLibraryData = context.queryClient.getQueryData<Book[]>(['openLibrary', debouncedQuery]);
          if (openLibraryData && openLibraryData.length > 0) {
            return Promise.resolve([] as Book[]);
          }
          return searchGoogleBooks(debouncedQuery);
        },
        enabled: debouncedQuery.length > 0
      }
    ]
  });
}
