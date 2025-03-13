import { useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQueries } from '@tanstack/react-query';
import { searchBooks } from '@/services/openLibrary';
import { searchGoogleBooks } from '@/services/googleBooks';
import { Book } from '@/types/book';
import { BookDetails } from '@/components/BookDetails';
import { removeDuplicateBooks } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast";
import NavBar from '@/components/NavBar';
import SearchBar from '@/components/SearchBar';

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
  const allBooks = [...(results[0].data || []), ...(results[1].data || [])];
  const books = removeDuplicateBooks(allBooks);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setDisplayedBooks(BOOKS_PER_PAGE);
    
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleBookClick = async (book: Book) => {
    const details = await getBookDetails(book.id);
    setSelectedBook({ ...book, ...details });
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
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div className="text-center flex-1">
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                Découvrez votre prochaine lecture
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-200">
                Explorez, partagez et découvrez de nouveaux livres
              </p>
            </div>
            <Link 
              to="/library" 
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Ma Bibliothèque
            </Link>
          </div>

          <SearchBar
            searchQuery={searchQuery}
            onSearch={handleSearch}
            onBookSelect={handleBookClick}
            suggestedBooks={books}
            isLoading={isLoading}
          />

          {isLoading && (
            <div className="text-center text-gray-600">
              Recherche en cours...
            </div>
          )}

          <div className="book-grid">
            {(!debouncedQuery ? [] : visibleBooks).map((book) => (
              <Card 
                key={book.id} 
                className="book-card group cursor-pointer"
                onClick={() => handleBookClick(book)}
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                <div className="book-info">
                  <h3 className="text-lg font-semibold">{book.title}</h3>
                  <p className="text-sm text-gray-600">
                    {Array.isArray(book.author) ? book.author[0] : book.author}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {debouncedQuery && visibleBooks.length === 0 && !isLoading && (
            <div className="text-center text-gray-600">
              Aucun livre trouvé
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
    </>
  );
};

export default Index;
