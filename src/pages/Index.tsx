
import { useState } from 'react';
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Book } from '@/types/book';
import { BookDetails } from '@/components/BookDetails';
import { useToast } from "@/components/ui/use-toast";
import NavBar from '@/components/NavBar';
import { searchBooks } from '@/services/bookSearch';

const BOOKS_PER_PAGE = 12;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [displayedBooks, setDisplayedBooks] = useState(BOOKS_PER_PAGE);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books', debouncedQuery],
    queryFn: () => searchBooks(debouncedQuery),
    enabled: debouncedQuery.length > 0
  });

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
    setSelectedBook(book);
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
                  Explorez la collection Gallica
                </p>
              </div>
              <Link 
                to="/library" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Ma Bibliothèque
              </Link>
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
                Recherche dans Gallica...
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
                    <h3 className="text-lg font-semibold dark:text-black">{book.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-800">
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
      </div>
    </>
  );
};

export default Index;
