
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { searchBooks } from '@/services/openLibrary';
import { getBookDetails } from '@/services/bookDetails';
import { Book } from '@/types/book';
import { BookDetails } from '@/components/BookDetails';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books', debouncedQuery],
    queryFn: () => searchBooks(debouncedQuery),
    enabled: debouncedQuery.length > 0
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleBookClick = async (book: Book) => {
    const details = await getBookDetails(book.id);
    setSelectedBook({ ...book, ...details });
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 fade-in">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Découvrez votre prochaine lecture
          </h1>
          <p className="text-lg text-gray-600">
            Explorez, partagez et découvrez de nouveaux livres
          </p>
        </div>

        <div className="relative mb-12 mx-auto max-w-2xl">
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
          {(!debouncedQuery ? [] : books).map((book) => (
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

        {debouncedQuery && books.length === 0 && !isLoading && (
          <div className="text-center text-gray-600">
            Aucun livre trouvé
          </div>
        )}

        {selectedBook && (
          <BookDetails
            book={selectedBook}
            isOpen={!!selectedBook}
            onClose={() => setSelectedBook(null)}
          />
        )}

        {books.length > 0 && (
          <div className="mt-12 text-center">
            <Button variant="outline" className="hover:bg-secondary">
              Voir plus de livres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
