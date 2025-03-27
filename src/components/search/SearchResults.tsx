
import { Book } from '@/types/book';
import { BookGrid } from '@/components/search/BookGrid';
import { BookDetails } from '@/components/BookDetails';
import { useSelectedBook } from '@/hooks/use-selected-book';
import { AddAllBooks } from '@/components/search/AddAllBooks';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface SearchResultsProps {
  books: Book[];
  displayedBooks: number;
  totalBooks: number;
  onBookClick: (book: Book) => void;
  onLoadMore: () => void;
  onShowAll: () => void;
  isLoading: boolean;
  searchQuery: string;
  isShowingAll: boolean;
  searchError?: string;
  onUpdate: () => void;
}

export function SearchResults({
  books,
  displayedBooks,
  totalBooks,
  onBookClick,
  onLoadMore,
  onShowAll,
  isLoading,
  searchQuery,
  isShowingAll,
  searchError,
  onUpdate
}: SearchResultsProps) {
  const { selectedBook, setSelectedBook, handleBookClick } = useSelectedBook(onUpdate);
  const { toast } = useToast();
  
  useEffect(() => {
    if (books.length === 0 && searchQuery && !isLoading && !searchError) {
      toast({
        title: "Aucun résultat explicite",
        description: "La recherche n'a trouvé aucun résultat correspondant explicitement à votre requête. Si vous cherchez un livre, essayez avec un titre exact.",
        duration: 5000,
      });
    }
  }, [books.length, searchQuery, isLoading, searchError, toast]);

  // Show different message for exhibition catalogs or art books
  useEffect(() => {
    if (searchQuery && (
      searchQuery.toLowerCase().includes('exposition') ||
      searchQuery.toLowerCase().includes('matisse') ||
      searchQuery.toLowerCase().includes('catalogue')
    )) {
      toast({
        title: "Types de résultats filtrés",
        description: "Les catalogues d'exposition, livres d'art et publications de musées sont automatiquement filtrés des résultats de recherche.",
        duration: 5000,
      });
    }
  }, [searchQuery, toast]);

  return (
    <>
      {books.length > 0 && searchQuery && (
        <div className="flex justify-end mb-4">
          <AddAllBooks 
            books={books} 
            onComplete={onUpdate} 
          />
        </div>
      )}

      <BookGrid 
        books={!searchQuery ? [] : books}
        onBookClick={(book) => {
          handleBookClick(book);
          onBookClick(book);
        }}
        displayedBooks={displayedBooks}
        totalBooks={totalBooks}
        onLoadMore={onLoadMore}
        onShowAll={onShowAll}
        isLoading={isLoading}
        searchQuery={searchQuery}
        isShowingAll={isShowingAll}
        searchError={searchError}
      />

      {isShowingAll && books.length > 0 && (
        <div className="mt-4 text-center bg-muted/30 py-2 rounded-md">
          Tous les {books.length} livres de l'auteur sont affichés
        </div>
      )}

      {selectedBook && (
        <BookDetails
          book={selectedBook}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}
