
import { useState } from 'react';
import { Book } from '@/types/book';
import { BookDetails } from '@/components/BookDetails';
import { useToast } from "@/hooks/use-toast";
import { SortMenu, SortOption } from '@/components/library/SortMenu';
import { ViewToggle } from '@/components/library/ViewToggle';
import { useBookSort } from '@/hooks/use-book-sort';
import { useViewPreference } from '@/hooks/use-view-preference';
import NavBar from '@/components/NavBar';
import { loadBooks } from '@/services/supabaseBooks';
import { useQuery } from '@tanstack/react-query';
import { BookSections } from '@/components/library/BookSections';
import { AuthorFilter } from '@/components/library/AuthorFilter';

export default function Library() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
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

  // Filter books by author if an author is selected
  const filteredBooks = selectedAuthor
    ? books.filter(book => {
        if (Array.isArray(book.author)) {
          return book.author.includes(selectedAuthor);
        }
        return book.author === selectedAuthor;
      })
    : books;

  const sortedBooks = sortBooks(filteredBooks, sortBy);

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

          <div className="mb-6">
            <AuthorFilter 
              books={books}
              selectedAuthor={selectedAuthor}
              onAuthorSelect={setSelectedAuthor}
            />
          </div>

          {sortedBooks.length === 0 ? (
            <p className="text-center text-gray-600 mt-8">
              {selectedAuthor 
                ? `Aucun livre de ${selectedAuthor} dans votre bibliothèque.`
                : "Votre bibliothèque est vide. Ajoutez des livres depuis la recherche !"}
            </p>
          ) : (
            <BookSections 
              books={sortedBooks}
              viewMode={viewMode}
              onBookClick={setSelectedBook}
            />
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
