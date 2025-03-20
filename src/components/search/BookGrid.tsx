
import { Book } from '@/types/book';
import { Button } from "@/components/ui/button";
import { BookCard } from './BookCard';

interface BookGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  displayedBooks: number;
  totalBooks: number;
  onLoadMore: () => void;
  isLoading: boolean;
  searchQuery: string;
}

export const BookGrid = ({ 
  books, 
  onBookClick, 
  displayedBooks, 
  totalBooks, 
  onLoadMore,
  isLoading,
  searchQuery
}: BookGridProps) => {
  const hasMoreBooks = displayedBooks < totalBooks;

  if (isLoading) {
    return (
      <div className="text-center text-gray-600">
        Recherche en cours...
      </div>
    );
  }

  if (searchQuery && books.length === 0) {
    return (
      <div className="flex flex-col items-center space-y-4 mt-8">
        <div className="text-center text-gray-600 mb-4">
          Aucun livre trouvé pour "{searchQuery}"
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="book-grid">
        {books.map((book) => (
          <BookCard 
            key={book.id} 
            book={book} 
            onBookClick={onBookClick} 
          />
        ))}
      </div>

      {searchQuery && books.length > 0 && (
        <div className="mt-12 text-center">
          {hasMoreBooks ? (
            <Button 
              variant="outline" 
              className="hover:bg-secondary"
              onClick={onLoadMore}
            >
              Voir plus de livres
            </Button>
          ) : totalBooks > 0 && (
            <p className="text-gray-600">
              Tous les livres ont été affichés
            </p>
          )}
        </div>
      )}
    </>
  );
};
