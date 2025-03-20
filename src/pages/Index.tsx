import { useState } from 'react';
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, ShoppingCart } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';
import { searchBooks } from '@/services/openLibrary';
import { searchGoogleBooks } from '@/services/googleBooks';
import { getBookDetails } from '@/services/bookDetails';
import { Book } from '@/types/book';
import { BookDetails } from '@/components/BookDetails';
import { removeDuplicateBooks, getAmazonAffiliateUrl } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import NavBar from '@/components/NavBar';
import { AddManualBook } from '@/components/AddManualBook';

const BOOKS_PER_PAGE = 12;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [displayedBooks, setDisplayedBooks] = useState(BOOKS_PER_PAGE);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  const results = useQueries({
    queries: [
      {
        queryKey: ['openLibrary', debouncedQuery],
        queryFn: () => searchBooks(debouncedQuery),
        enabled: debouncedQuery.length > 0
      },
      {
        queryKey: ['googleBooks', debouncedQuery],
        queryFn: () => searchGoogleBooks(debouncedQuery),
        enabled: debouncedQuery.length > 0
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setDisplayedBooks(BOOKS_PER_PAGE);
    
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

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

  const getAmazonSearchUrl = (book: Book) => {
    return getAmazonAffiliateUrl(book);
  };

  const handleAmazonClick = (e: React.MouseEvent<HTMLAnchorElement>, book: Book) => {
    e.stopPropagation(); // Éviter de déclencher handleBookClick
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
  };

  const visibleBooks = books.slice(0, displayedBooks);
  const hasMoreBooks = displayedBooks < books.length;

  return (
    <>
      <div className="min-h-screen">
        <NavBar />
        <div className="container px-4 py-6 sm:py-8 sm:px-6 lg:px-8 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 sm:mb-12">
              <div className="text-center sm:text-left flex-1">
                <h1 className="mb-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Découvrez votre prochaine lecture
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-200">
                  Explorez, partagez et découvrez de nouveaux livres
                </p>
              </div>
              <div className="flex gap-4 items-center w-full sm:w-auto">
                <AddManualBook onBookAdded={handleBookUpdate} />
                <Link 
                  to="/library" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Ma Bibliothèque
                </Link>
              </div>
            </div>

            <div className="relative mb-8 sm:mb-12">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher un livre, un auteur..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            {isLoading && (
              <div className="text-center text-gray-600">
                Recherche en cours...
              </div>
            )}

            <div className="book-grid">
              {(!debouncedQuery ? [] : visibleBooks).map((book) => (
                <Card 
                  key={book.id} 
                  className="book-card group cursor-pointer relative"
                  onClick={() => handleBookClick(book)}
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="book-info">
                    <h3 className="text-lg font-semibold dark:text-black">{book.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-800">
                      {Array.isArray(book.author) ? book.author[0] : book.author}
                    </p>
                    <a 
                      href={getAmazonSearchUrl(book)}
                      onClick={(e) => handleAmazonClick(e, book)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Acheter sur Amazon"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </a>
                  </div>
                </Card>
              ))}
            </div>

            {debouncedQuery && visibleBooks.length === 0 && !isLoading && (
              <div className="flex flex-col items-center space-y-4 mt-8">
                <div className="text-center text-gray-600 mb-4">
                  Aucun livre trouvé pour "{debouncedQuery}"
                </div>
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

            {debouncedQuery && visibleBooks.length > 0 && (
              <div className="mt-12 text-center">
                {hasMoreBooks ? (
                  <Button 
                    variant="outline" 
                    className="hover:bg-secondary"
                    onClick={handleLoadMore}
                  >
                    Voir plus de livres
                  </Button>
                ) : books.length > BOOKS_PER_PAGE && (
                  <p className="text-gray-600">
                    Tous les livres ont été affichés
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
