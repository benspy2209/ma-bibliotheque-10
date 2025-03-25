
import { Book } from '@/types/book';
import { Button } from "@/components/ui/button";
import { BookCard } from './BookCard';
import { BookOpen } from 'lucide-react';

interface BookGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  displayedBooks: number;
  totalBooks: number;
  onLoadMore: () => void;
  onShowAll?: () => void;
  isLoading: boolean;
  searchQuery: string;
  isShowingAll?: boolean;
}

export const BookGrid = ({ 
  books, 
  onBookClick, 
  displayedBooks, 
  totalBooks, 
  onLoadMore,
  onShowAll,
  isLoading,
  searchQuery,
  isShowingAll = false
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
          {hasMoreBooks && !isShowingAll ? (
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="hover:bg-secondary flex items-center gap-2"
                onClick={onLoadMore}
              >
                Voir plus de livres
              </Button>
              
              {onShowAll && (
                <div className="pt-2">
                  <Button 
                    variant="link"
                    onClick={onShowAll}
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Afficher tous les {totalBooks} livres de l'auteur
                  </Button>
                </div>
              )}
            </div>
          ) : isShowingAll ? (
            <p className="text-gray-600 py-2 px-4 bg-muted inline-block rounded-md">
              Tous les {totalBooks} livres de l'auteur sont affichés
            </p>
          ) : totalBooks > 0 && (
            <p className="text-gray-600 py-2 px-4 bg-muted inline-block rounded-md">
              Tous les livres ont été affichés
            </p>
          )}
        </div>
      )}
    </>
  );
};
