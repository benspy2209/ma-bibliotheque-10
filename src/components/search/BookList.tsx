
import { Book } from '@/types/book';
import { BookCard } from './BookCard';
import { AlertCircle, Search } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BookListProps {
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

export const BookList = ({ 
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
}: BookListProps) => {
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
      <div className="space-y-4">
        {books.map((book) => (
          <Card 
            key={book.id}
            className="flex hover:shadow-lg transition-shadow cursor-pointer animate-fade-in"
            onClick={() => onBookClick(book)}
          >
            <div className="relative w-[100px] h-[150px] shrink-0">
              <img
                src={book.cover || '/placeholder.svg'}
                alt={book.title}
                className="absolute w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            <div className="flex flex-col p-4">
              <h3 className="font-semibold text-lg">{book.title}</h3>
              <p className="text-sm text-muted-foreground">
                {Array.isArray(book.author) ? book.author[0] : book.author}
              </p>
              {book.publishers && book.publishers.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {book.publishers[0]}
                </p>
              )}
              {book.language && book.language[0] && (
                <p className="text-xs mt-auto">
                  Langue: {book.language[0] === 'fr' ? 'Français' : 
                           book.language[0] === 'en' ? 'Anglais' : book.language[0]}
                </p>
              )}
            </div>
          </Card>
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
