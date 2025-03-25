import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchAllBooks, SearchType, LanguageFilter } from '@/services/bookSearch';
import { getBookDetails } from '@/services/bookDetails';
import { Book } from '@/types/book';
import { BookDetails } from '@/components/BookDetails';
import { useToast } from "@/hooks/use-toast";
import NavBar from '@/components/NavBar';
import { SearchBar } from '@/components/search/SearchBar';
import { BookGrid } from '@/components/search/BookGrid';
import { HeaderSection } from '@/components/search/HeaderSection';
import Footer from '@/components/Footer';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { supabase } from '@/integrations/supabase/client';
import { SearchLimitResponse, isSearchLimitResponse } from '@/types/searchLimits';

const BOOKS_PER_PAGE = 12;
const MAX_SEARCH_RESULTS = 100; // Increased limit for search results

const Index = () => {
  const [searchParams, setSearchParams] = useState<{ 
    query: string; 
    type: SearchType;
    language: LanguageFilter;
  }>({ 
    query: '', 
    type: 'author',
    language: 'fr'
  });
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [displayedBooks, setDisplayedBooks] = useState(BOOKS_PER_PAGE);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchLimitReached, setSearchLimitReached] = useState(false);
  const [remainingSearches, setRemainingSearches] = useState<number | null>(null);
  const [showAllResults, setShowAllResults] = useState(false);
  const [searchError, setSearchError] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const { user, showLoginDialog, setShowLoginDialog } = useSupabaseAuth();

  useEffect(() => {
    if (user) {
      checkSearchLimits();
    }
  }, [user]);

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
        } else if (data.remaining !== -1) {
          toast({
            description: `Il vous reste ${data.remaining} recherche(s) aujourd'hui.`
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'incrémentation du compteur:", error);
    }
  };

  const handleSearch = async (query: string, searchType: SearchType, language: LanguageFilter) => {
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
    setDisplayedBooks(BOOKS_PER_PAGE);
    
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
    onError: (error) => {
      console.error("Erreur lors de la recherche:", error);
      setSearchError("Une erreur est survenue lors de la recherche. Veuillez réessayer plus tard.");
    }
  });

  const handleBookClick = async (book: Book) => {
    try {
      if (!book || !book.id) {
        toast({
          description: "Impossible d'afficher les détails de ce livre.",
          variant: "destructive"
        });
        return;
      }
      const details = await getBookDetails(book.id, searchParams.language);
      setSelectedBook({ ...book, ...details });
    } catch (error) {
      console.error("Erreur lors du chargement des détails:", error);
      toast({
        description: "Erreur lors du chargement des détails du livre.",
        variant: "destructive"
      });
    }
  };

  const handleLoadMore = () => {
    if (displayedBooks >= books.length) {
      toast({
        description: "Il n'y a plus de livres à afficher.",
      });
      return;
    }
    setDisplayedBooks(prev => prev + BOOKS_PER_PAGE);
  };

  const handleShowAllBooks = () => {
    setShowAllResults(true);
    setDisplayedBooks(books.length);
    toast({
      description: `Affichage de tous les ${books.length} livres de l'auteur.`,
    });
  };

  const handleBookUpdate = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  const visibleBooks = showAllResults ? books : books.slice(0, displayedBooks);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container px-4 py-6 sm:py-8 sm:px-6 lg:px-8 mx-auto flex-grow">
        <div className="max-w-4xl mx-auto">
          <HeaderSection onBookAdded={handleBookUpdate} />

          <div className="mb-8 sm:mb-12">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Rechercher un livre, un auteur..."
              showAllResults={handleShowAllBooks}
              hasMoreResults={books.length > displayedBooks && !showAllResults}
              totalBooks={books.length}
            />
            {user && remainingSearches !== null && remainingSearches !== -1 && (
              <div className="text-sm text-muted-foreground mt-2">
                {searchLimitReached 
                  ? "Vous avez atteint votre limite de 3 recherches par jour." 
                  : `Recherches restantes aujourd'hui : ${remainingSearches}`}
              </div>
            )}
          </div>

          <BookGrid 
            books={!searchParams.query ? [] : visibleBooks}
            onBookClick={handleBookClick}
            displayedBooks={displayedBooks}
            totalBooks={books.length}
            onLoadMore={handleLoadMore}
            onShowAll={handleShowAllBooks}
            isLoading={isLoading}
            searchQuery={searchParams.query}
            isShowingAll={showAllResults}
            searchError={searchError}
          />

          {showAllResults && books.length > 0 && (
            <div className="mt-4 text-center bg-muted/30 py-2 rounded-md">
              Tous les {books.length} livres de l'auteur sont affichés
            </div>
          )}

          {selectedBook && (
            <BookDetails
              book={selectedBook}
              isOpen={!!selectedBook}
              onClose={() => setSelectedBook(null)}
              onUpdate={handleBookUpdate}
            />
          )}
        </div>
      </div>
      <Footer />
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  );
};

export default Index;
