
import { useState, useEffect } from 'react';
import { useQueries } from '@tanstack/react-query';
import { searchBooks } from '@/services/openLibrary';
import { searchGoogleBooks } from '@/services/googleBooks';
import { getBookDetails } from '@/services/bookDetails';
import { Book } from '@/types/book';
import { BookDetails } from '@/components/BookDetails';
import { removeDuplicateBooks } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import NavBar from '@/components/NavBar';
import { SearchBar } from '@/components/search/SearchBar';
import { BookGrid } from '@/components/search/BookGrid';
import { HeaderSection } from '@/components/search/HeaderSection';
import Footer from '@/components/Footer';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { supabase } from '@/integrations/supabase/client';

const BOOKS_PER_PAGE = 12;

const Index = () => {
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [displayedBooks, setDisplayedBooks] = useState(BOOKS_PER_PAGE);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchLimitReached, setSearchLimitReached] = useState(false);
  const [remainingSearches, setRemainingSearches] = useState<number | null>(null);
  const { toast } = useToast();
  const { user, showLoginDialog, setShowLoginDialog } = useSupabaseAuth();

  // Vérifier les limites de recherche à l'initialisation
  useEffect(() => {
    checkSearchLimits();
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
    try {
      const ip = await getUserIp();
      const { data, error } = await supabase.rpc('can_perform_search', {
        p_user_id: user?.id || null,
        p_ip_address: ip
      });

      if (error) {
        console.error("Erreur lors de la vérification des limites de recherche:", error);
        return;
      }

      if (data) {
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
    if (!debouncedQuery) return;
    
    try {
      const ip = await getUserIp();
      const { data, error } = await supabase.rpc('increment_search_count', {
        p_user_id: user?.id || null,
        p_ip_address: ip
      });

      if (error) {
        console.error("Erreur lors de l'incrémentation du compteur:", error);
        return;
      }

      if (data) {
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
  const handleSearch = async (query: string) => {
    // Si la recherche est vide, ne pas incrémenter le compteur
    if (!query.trim()) {
      setDebouncedQuery('');
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
    setDebouncedQuery(query);
  };

  const results = useQueries({
    queries: [
      {
        queryKey: ['openLibrary', debouncedQuery, refreshKey],
        queryFn: () => searchBooks(debouncedQuery),
        enabled: debouncedQuery.length > 0 && !searchLimitReached
      },
      {
        queryKey: ['googleBooks', debouncedQuery, refreshKey],
        queryFn: () => searchGoogleBooks(debouncedQuery),
        enabled: debouncedQuery.length > 0 && !searchLimitReached
      }
    ]
  });

  const isLoading = results.some(result => result.isLoading);
  const allBooks = [
    ...(results[0].data || []), 
    ...(results[1].data || [])
  ].filter(book => 
    book && 
    book.title && 
    book.language && 
    (book.language.includes('fr') || book.language.includes('fre') || book.language.includes('fra'))
  );
  const books = removeDuplicateBooks(allBooks);
  
  console.log(`Total des résultats combinés en français: ${books.length} livres`);

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
    results.forEach(result => result.refetch());
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
            {remainingSearches !== null && remainingSearches !== -1 && (
              <div className="text-sm text-muted-foreground mt-2">
                {searchLimitReached 
                  ? "Vous avez atteint votre limite de 3 recherches par jour." 
                  : `Recherches restantes aujourd'hui : ${remainingSearches}`}
              </div>
            )}
          </div>

          <BookGrid 
            books={!debouncedQuery ? [] : visibleBooks}
            onBookClick={handleBookClick}
            displayedBooks={displayedBooks}
            totalBooks={books.length}
            onLoadMore={handleLoadMore}
            isLoading={isLoading}
            searchQuery={debouncedQuery}
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
