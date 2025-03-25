
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchAllBooks, SearchType } from '@/services/bookSearch';
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

const Index = () => {
  const [searchParams, setSearchParams] = useState<{ query: string; type: SearchType }>({ 
    query: '', 
    type: 'author' 
  });
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [displayedBooks, setDisplayedBooks] = useState(BOOKS_PER_PAGE);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchLimitReached, setSearchLimitReached] = useState(false);
  const [remainingSearches, setRemainingSearches] = useState<number | null>(null);
  const { toast } = useToast();
  const { user, showLoginDialog, setShowLoginDialog } = useSupabaseAuth();

  // Vérifier les limites de recherche à l'initialisation
  useEffect(() => {
    if (user) {
      checkSearchLimits();
    }
  }, [user]);

  // Fonction pour obtenir l'adresse IP de l'utilisateur (simplifiée pour la démo)
  const getUserIp = async (): Promise<string> => {
    try {
      // En production, il faudrait utiliser un service comme ipify.org
      return '127.0.0.1'; // Adresse IP par défaut pour la démo
    } catch (error) {
      console.error("Erreur lors de la récupération de l'IP:", error);
      return '127.0.0.1';
    }
  };

  // Vérifier si l'utilisateur peut effectuer une recherche
  const checkSearchLimits = async () => {
    if (!user) return; // Ne pas vérifier les limites si l'utilisateur n'est pas connecté
    
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

  // Incrémenter le compteur de recherche
  const incrementSearchCount = async () => {
    if (!searchParams.query || !user) return; // Ne pas incrémenter si aucun utilisateur ou aucune requête
    
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
          // Ne pas afficher pour l'administrateur qui a un nombre illimité (-1)
          toast({
            description: `Il vous reste ${data.remaining} recherche(s) aujourd'hui.`
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'incrémentation du compteur:", error);
    }
  };

  // Fonction de recherche avec vérification des limites
  const handleSearch = async (query: string, searchType: SearchType) => {
    // Si la recherche est vide, ne pas incrémenter le compteur
    if (!query.trim()) {
      setSearchParams({ query: '', type: searchType });
      return;
    }
    
    // Vérifier si l'utilisateur est connecté
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter ou créer un compte pour faire une recherche.",
        variant: "destructive"
      });
      return;
    }
    
    // Vérifier si l'utilisateur a déjà atteint sa limite
    if (searchLimitReached) {
      toast({
        title: "Limite de recherche atteinte",
        description: "Vous avez atteint votre limite de 3 recherches par jour.",
        variant: "destructive"
      });
      return;
    }
    
    // Incrémenter le compteur de recherche
    await incrementSearchCount();
    
    // Si la limite n'est pas atteinte, effectuer la recherche
    setSearchParams({ query, type: searchType });
  };

  // Utiliser useQuery pour la recherche unifiée
  const { 
    data: books = [], 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['allBooks', searchParams.query, searchParams.type, refreshKey],
    queryFn: () => searchAllBooks(searchParams.query, searchParams.type),
    enabled: searchParams.query.length > 0 && !searchLimitReached && !!user
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
      const details = await getBookDetails(book.id);
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

  const handleBookUpdate = () => {
    setRefreshKey(prev => prev + 1);
    // Forcer l'actualisation des données
    refetch();
  };

  const visibleBooks = books.slice(0, displayedBooks);

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
            isLoading={isLoading}
            searchQuery={searchParams.query}
          />

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
