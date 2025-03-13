
import { useState } from 'react';
import { Book } from '@/types/book';
import { BookDetails } from '@/components/BookDetails';
import { useToast } from "@/hooks/use-toast";
import { BookGrid } from '@/components/library/BookGrid';
import { BookList } from '@/components/library/BookList';
import { SortMenu, SortOption } from '@/components/library/SortMenu';
import { ViewToggle } from '@/components/library/ViewToggle';
import { useBookSort } from '@/hooks/use-book-sort';
import { useViewPreference } from '@/hooks/use-view-preference';
import NavBar from '@/components/NavBar';
import { loadBooks } from '@/services/supabaseBooks';
import { useQuery } from '@tanstack/react-query';

export default function Library() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const { toast } = useToast();
  const { sortBooks } = useBookSort();
  const { viewMode, toggleView } = useViewPreference();

  const { data: books = [], refetch } = useQuery({
    queryKey: ['books'],
    queryFn: loadBooks,
    meta: {
      onError: (error: Error) => {
        console.error("Erreur lors du chargement des livres:", error);
        toast({
          variant: "destructive",
          description: "Une erreur est survenue lors du chargement de votre bibliothèque.",
        });
      }
    }
  });

  const sortedBooks = sortBooks(books, sortBy);

  const handleBookUpdate = () => {
    refetch();
  };

  return (
    <div className="min-h-screen fade-in">
      <NavBar />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Ma Bibliothèque</h1>
            <div className="flex items-center gap-2">
              <SortMenu sortBy={sortBy} onSortChange={setSortBy} />
              <ViewToggle viewMode={viewMode} onToggle={toggleView} />
            </div>
          </div>
          
          {sortedBooks.length === 0 ? (
            <p className="text-center text-gray-600">
              Votre bibliothèque est vide. Ajoutez des livres depuis la recherche !
            </p>
          ) : viewMode === 'grid' ? (
            <BookGrid books={sortedBooks} onBookClick={setSelectedBook} />
          ) : (
            <BookList books={sortedBooks} onBookClick={setSelectedBook} />
          )}

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
    </div>
  );
}
