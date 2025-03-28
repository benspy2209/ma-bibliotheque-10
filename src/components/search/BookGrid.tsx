
import { Book } from '@/types/book';
import { Button } from "@/components/ui/button";
import { BookCard } from './BookCard';
import { BookOpen, AlertCircle, Search } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  searchError?: string;
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
  isShowingAll = false,
  searchError
}: BookGridProps) => {
  const hasMoreBooks = displayedBooks < totalBooks;

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-600">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-muted mb-4"></div>
          <div className="text-lg">Recherche en cours...</div>
        </div>
      </div>
    );
  }

  if (searchError) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {searchError}
        </AlertDescription>
      </Alert>
    );
  }

  if (searchQuery && books.length === 0) {
    return (
      <div className="flex flex-col items-center space-y-4 mt-8">
        <div className="bg-muted/30 rounded-full p-6 mb-2">
          <Search className="h-12 w-12 text-muted-foreground/60" />
        </div>
        <div className="text-center text-gray-600 mb-4">
          <p className="text-lg font-medium">Aucun livre ou BD trouvé pour "{searchQuery}"</p>
          <p className="text-sm mt-2">
            Nous n'avons trouvé aucun résultat correspondant à votre recherche.
            {searchQuery.length < 4 ? " Essayez avec plus de caractères." : ""}
          </p>
          <div className="mt-4 text-sm">
            Suggestions :
            <ul className="list-disc list-inside mt-2 text-left max-w-md mx-auto">
              <li>Vérifiez l'orthographe du nom de l'auteur ou du titre</li>
              <li>Pour les BD, essayez de rechercher par série ou dessinateur</li>
              <li>Essayez avec un nom plus complet (prénom et nom)</li>
              <li>Utilisez des termes de recherche différents</li>
              <li>Essayez de changer le filtre de langue</li>
            </ul>
          </div>
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
}
