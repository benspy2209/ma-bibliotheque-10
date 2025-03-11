
import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { BookDetails } from '@/components/BookDetails';
import { useToast } from "@/components/ui/use-toast";
import { BookGrid } from '@/components/library/BookGrid';
import { SortMenu, SortOption } from '@/components/library/SortMenu';
import { useBookSort } from '@/hooks/use-book-sort';
import NavBar from '@/components/NavBar';

export default function Library() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const { toast } = useToast();
  const { sortBooks } = useBookSort();

  const loadBooks = () => {
    try {
      console.log("Chargement des livres...");
      
      // Vérifier le localStorage du domaine principal
      let storedBooks = Object.entries(localStorage)
        .filter(([key]) => key.startsWith('book_'))
        .map(([_, value]) => {
          try {
            return JSON.parse(value);
          } catch (error) {
            console.error("Erreur lors du parsing d'un livre:", error);
            return null;
          }
        })
        .filter((book): book is Book => book !== null);

      // Si aucun livre n'est trouvé, vérifier l'ancien domaine
      if (storedBooks.length === 0) {
        const oldDomainBooks = Object.entries(window.localStorage)
          .filter(([key]) => key.startsWith('book_'))
          .map(([_, value]) => {
            try {
              return JSON.parse(value);
            } catch (error) {
              console.error("Erreur lors du parsing d'un livre de l'ancien domaine:", error);
              return null;
            }
          })
          .filter((book): book is Book => book !== null);

        // Si des livres sont trouvés dans l'ancien domaine, les copier dans le nouveau
        if (oldDomainBooks.length > 0) {
          oldDomainBooks.forEach(book => {
            localStorage.setItem(`book_${book.id}`, JSON.stringify(book));
          });
          storedBooks = oldDomainBooks;
          toast({
            description: "Votre bibliothèque a été restaurée avec succès !",
          });
        }
      }
      
      console.log("Nombre de livres trouvés:", storedBooks.length);
      const sortedBooks = sortBooks(storedBooks, sortBy);
      setBooks(sortedBooks);
    } catch (error) {
      console.error("Erreur lors du chargement des livres:", error);
      toast({
        variant: "destructive",
        description: "Une erreur est survenue lors du chargement de votre bibliothèque.",
      });
    }
  };

  useEffect(() => {
    loadBooks();
  }, [refreshKey, sortBy]);

  const handleBookUpdate = () => {
    loadBooks();
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Ma Bibliothèque</h1>
            <SortMenu sortBy={sortBy} onSortChange={setSortBy} />
          </div>
          
          {books.length === 0 ? (
            <p className="text-center text-gray-600">
              Votre bibliothèque est vide. Ajoutez des livres depuis la recherche !
            </p>
          ) : (
            <BookGrid books={books} onBookClick={setSelectedBook} />
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
