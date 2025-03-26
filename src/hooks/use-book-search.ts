
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchAllBooks, SearchType, LanguageFilter } from '@/services/bookSearch';
import { supabase } from '@/integrations/supabase/client';
import { SearchLimitResponse, isSearchLimitResponse } from '@/types/searchLimits';
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

const MAX_SEARCH_RESULTS = 100;

export function useBookSearch() {
  const [searchParams, setSearchParams] = useState<{ 
    query: string; 
    type: SearchType;
    language: LanguageFilter;
  }>({ 
    query: '', 
    type: 'author',
    language: 'fr'
  });
  const [displayedBooks, setDisplayedBooks] = useState(12);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchLimitReached, setSearchLimitReached] = useState(false);
  const [remainingSearches, setRemainingSearches] = useState<number | null>(null);
  const [showAllResults, setShowAllResults] = useState(false);
  const [searchError, setSearchError] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const { user } = useSupabaseAuth();

  const getUserIp = async (): Promise<string> => {
    try {
      return '127.0.0.1';
    } catch (error) {
      console.error("Erreur lors de la récupération de l'IP:", error);
      return '127.0.0.1';
    }
  };

  const checkSearchLimits = async () => {
    if (!user) return;

    try {
      const ip = await getUserIp();
      const { data, error } = await supabase.rpc('can_perform_search', {
        p_user_id: user.id,
        p_ip_address: ip
      });

      if (error) {
        console.error("Erreur lors de la vérification des limites de recherche:", error);
        return;
      }

      if (data && isSearchLimitResponse(data)) {
        setSearchLimitReached(!data.can_search);
        setRemainingSearches(data.remaining);
        
        // Fix: Changed comparison to handle -1 (unlimited) differently
        if (!data.can_search) {
          toast({
            title: "Limite de recherche atteinte",
            description: "Vous avez atteint votre limite de 3 recherches par jour.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification des limites:", error);
    }
  };

  const incrementSearchCount = async () => {
    if (!searchParams.query || !user) return;

    try {
      const ip = await getUserIp();
      const { data, error } = await supabase.rpc('increment_search_count', {
        p_user_id: user.id,
        p_ip_address: ip
      });

      if (error) {
        console.error("Erreur lors de l'incrémentation du compteur:", error);
        return;
      }

      if (data && isSearchLimitResponse(data)) {
        setRemainingSearches(data.remaining);
        
        if (!data.success) {
          setSearchLimitReached(true);
          toast({
            title: "Limite de recherche atteinte",
            description: "Vous avez atteint votre limite de 3 recherches par jour.",
            variant: "destructive"
          });
        } else {
          // Fix: Handle -1 (unlimited) separately from other positive numbers
          const isUnlimited = data.remaining === -1;
          if (!isUnlimited) {
            toast({
              description: `Il vous reste ${data.remaining} recherche(s) aujourd'hui.`
            });
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'incrémentation du compteur:", error);
    }
  };

  const handleSearch = async (query: string, searchType: SearchType, language: LanguageFilter): Promise<void> => {
    setSearchError(undefined);
    
    if (!query.trim()) {
      setSearchParams({ query: '', type: searchType, language });
      setShowAllResults(false);
      return;
    }
    
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter ou créer un compte pour faire une recherche.",
        variant: "destructive"
      });
      return;
    }
    
    if (searchLimitReached) {
      toast({
        title: "Limite de recherche atteinte",
        description: "Vous avez atteint votre limite de 3 recherches par jour.",
        variant: "destructive"
      });
      return;
    }
    
    setShowAllResults(false);
    setDisplayedBooks(12);
    
    await incrementSearchCount();
    
    setSearchParams({ query, type: searchType, language });
  };

  const { 
    data: books = [], 
    isLoading,
    refetch,
    error: queryError 
  } = useQuery({
    queryKey: ['allBooks', searchParams.query, searchParams.type, searchParams.language, refreshKey],
    queryFn: () => searchAllBooks(searchParams.query, searchParams.type, searchParams.language, MAX_SEARCH_RESULTS),
    enabled: searchParams.query.length > 0 && !searchLimitReached && !!user,
    retry: 1,
    meta: {
      onError: (error: Error) => {
        console.error("Erreur lors de la recherche:", error);
        setSearchError("Une erreur est survenue lors de la recherche. Veuillez réessayer plus tard.");
      }
    }
  });

  const handleLoadMore = () => {
    if (displayedBooks >= books.length) {
      toast({
        description: "Il n'y a plus de livres à afficher.",
      });
      return;
    }
    setDisplayedBooks(prev => prev + 12);
  };

  const handleShowAllBooks = () => {
    setShowAllResults(true);
    setDisplayedBooks(books.length);
    toast({
      description: `Affichage de tous les ${books.length} livres de l'auteur.`,
    });
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  const visibleBooks = showAllResults ? books : books.slice(0, displayedBooks);

  return {
    searchParams,
    books,
    visibleBooks,
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
    searchQuery: searchParams.query,
    totalBooks: books.length
  };
}
