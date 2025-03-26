
import { useState, useEffect, useCallback } from 'react';
import { Book } from '@/types/book';
// Remove the non-existent imports and use functions directly from the services
import { searchAllBooks, SearchType, LanguageFilter } from '@/services/bookSearch';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

export function useBookSearch() {
  const [books, setBooks] = useState<Book[]>([]);
  const [visibleBooks, setVisibleBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [searchError, setSearchError] = useState<string | undefined>();
  const [displayedBooks, setDisplayedBooks] = useState(10);
  const [showAllResults, setShowAllResults] = useState(false);
  const [searchParams, setSearchParams] = useState('');
  const [totalBooks, setTotalBooks] = useState(0);
  const [remainingSearches, setRemainingSearches] = useState<number | null>(null);
  const [searchLimitReached, setSearchLimitReached] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useSupabaseAuth();

  const checkSearchLimits = useCallback(async () => {
    if (!user) {
      setRemainingSearches(null);
      setSearchLimitReached(false);
      return true;
    }

    try {
      const { data, error } = await supabase.rpc('can_perform_search', {
        p_user_id: user.id,
        p_ip_address: '127.0.0.1' // On utilise une IP par défaut car l'IP réelle n'est pas accessible côté client
      });

      if (error) {
        console.error('Error checking search limits:', error);
        return true; // En cas d'erreur, on autorise la recherche
      }

      // Cast to the appropriate type and handle the response
      const result = data as unknown as { can_search: boolean; remaining: number; message: string };
      
      console.log('Search limits check result:', result);
      
      if (result.remaining !== undefined) {
        setRemainingSearches(result.remaining);
      }
      
      // Fix comparison: Check if remaining is 0 and NOT negative 1 
      // (unlimited) using !== instead of equality check with different types
      setSearchLimitReached(result.remaining === 0 && result.remaining !== -1);
      
      return result.can_search;
    } catch (error) {
      console.error('Error in checkSearchLimits:', error);
      return true; // En cas d'erreur, on autorise la recherche
    }
  }, [user]);

  const incrementSearchCount = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('increment_search_count', {
        p_user_id: user.id,
        p_ip_address: '127.0.0.1'
      });

      if (error) {
        console.error('Error incrementing search count:', error);
        return;
      }

      // Cast to appropriate type and handle the response
      const result = data as unknown as { success: boolean; remaining: number; message: string };
      
      if (result.remaining !== undefined) {
        setRemainingSearches(result.remaining);
      }
      
      // Fix the comparison logic with proper type checks
      if (result.remaining === 0) {
        // Only set to true if not unlimited (-1)
        setSearchLimitReached(result.remaining !== -1);
      } else {
        setSearchLimitReached(false);
      }
      
    } catch (error) {
      console.error('Error in incrementSearchCount:', error);
    }
  }, [user]);

  const handleSearch = async (
    searchParams: string,
    searchType: SearchType,
    language: LanguageFilter
  ) => {
    setIsLoading(true);
    setIsError(false);
    setSearchError(undefined);
    setDisplayedBooks(10);
    setShowAllResults(false);
    setSearchQuery(searchParams);

    const canSearch = await checkSearchLimits();
    if (!canSearch) {
      setIsLoading(false);
      setSearchLimitReached(true);
      setBooks([]);
      setVisibleBooks([]);
      setTotalBooks(0);
      return;
    }

    try {
      await incrementSearchCount();
      // Use searchAllBooks and properly handle the return type
      const searchResult = await searchAllBooks(searchParams, searchType, language);
      setBooks(searchResult.results);
      setVisibleBooks(searchResult.results.slice(0, displayedBooks));
      setTotalBooks(searchResult.total);
    } catch (error: any) {
      setIsError(true);
      setSearchError(error.message || 'Une erreur est survenue lors de la recherche.');
      setBooks([]);
      setVisibleBooks([]);
      setTotalBooks(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    const newDisplayedBooks = displayedBooks + 10;
    setVisibleBooks(books.slice(0, newDisplayedBooks));
    setDisplayedBooks(newDisplayedBooks);
  };

  const handleShowAllBooks = () => {
    setVisibleBooks(books);
    setShowAllResults(true);
  };

  const handleRefresh = () => {
    // Force a refresh of the data
    setVisibleBooks(books.slice(0, displayedBooks));
  };

  useEffect(() => {
    setVisibleBooks(books.slice(0, displayedBooks));
  }, [books, displayedBooks]);

  return {
    searchParams,
    visibleBooks,
    books,
    isLoading, 
    showAllResults,
    displayedBooks,
    remainingSearches,
    searchLimitReached,
    searchError,
    handleSearch,
    handleLoadMore,
    handleShowAllBooks,
    handleRefresh,
    checkSearchLimits,
    searchQuery,
    totalBooks
  };
}
