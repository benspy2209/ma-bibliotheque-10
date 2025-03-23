
import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { searchBooks } from '@/services/openLibrary';
import { searchGoogleBooks } from '@/services/googleBooks';
import { getBookDetails } from '@/services/bookDetails';
import { Book } from '@/types/book';
import { BookDetails } from '@/components/BookDetails';
import { removeDuplicateBooks } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import NavBar from '@/components/NavBar';
import { SearchBar } from '@/components/search/SearchBar';
import { BookGrid } from '@/components/search/BookGrid';
import { HeaderSection } from '@/components/search/HeaderSection';
import { Button } from '@/components/ui/button';
import { removeSpecificBook } from '@/utils/bookCleanup';
import { Loader2 } from 'lucide-react';

const BOOKS_PER_PAGE = 12;

const Index = () => {
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [displayedBooks, setDisplayedBooks] = useState(BOOKS_PER_PAGE);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRemoving, setIsRemoving] = useState(false);
  const { toast } = useToast();

  const results = useQueries({
    queries: [
      {
        queryKey: ['openLibrary', debouncedQuery],
        queryFn: () => searchBooks(debouncedQuery),
        enabled: debouncedQuery.length > 0
      },
      {
        queryKey: ['googleBooks', debouncedQuery],
        queryFn: () => searchGoogleBooks(debouncedQuery),
        enabled: debouncedQuery.length > 0
      }
    ]
  });

  const isLoading = results.some(result => result.isLoading);
  const allBooks = [
    ...(results[0].data || []), 
    ...(results[1].data || [])
  ].filter(book => 
    book && 
    book.title && 
    book.language && 
    (book.language.includes('fr') || book.language.includes('fre') || book.language.includes('fra'))
  );
  const books = removeDuplicateBooks(allBooks);
  
  console.log(`Total des résultats combinés en français: ${books.length} livres`);

  const handleBookClick = async (book: Book) => {
    try {
      if (!book || !book.id) {
        toast({
          description: "Impossible d'afficher les détails de ce livre.",
          variant: "destructive"
        });
        return;
      }
      const details = await getBookDetails(book.id);
      setSelectedBook({ ...book, ...details });
    } catch (error) {
      console.error("Erreur lors du chargement des détails:", error);
      toast({
        description: "Erreur lors du chargement des détails du livre.",
        variant: "destructive"
      });
    }
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

  const handleRemoveSpecificBook = async () => {
    setIsRemoving(true);
    try {
      const result = await removeSpecificBook("Purgatoire des innocents", "Karine Giebel");
      toast({
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
      
      if (result.success) {
        // Si le livre a été supprimé avec succès, rafraîchir la bibliothèque
        handleBookUpdate();
      }
    } catch (error) {
      toast({
        description: "Une erreur est survenue lors de la suppression du livre.",
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const visibleBooks = books.slice(0, displayedBooks);

  return (
    <>
      <div className="min-h-screen">
        <NavBar />
        <div className="container px-4 py-6 sm:py-8 sm:px-6 lg:px-8 mx-auto">
          <div className="max-w-4xl mx-auto">
            <HeaderSection onBookAdded={handleBookUpdate} />
            
            <div className="mb-4 text-right">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleRemoveSpecificBook}
                disabled={isRemoving}
              >
                {isRemoving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suppression en cours...
                  </>
                ) : (
                  "Supprimer 'Purgatoire des innocents'"
                )}
              </Button>
            </div>

            <div className="mb-8 sm:mb-12">
              <SearchBar 
                onSearch={setDebouncedQuery}
                placeholder="Rechercher un livre, un auteur..."
              />
            </div>

            <BookGrid 
              books={!debouncedQuery ? [] : visibleBooks}
              onBookClick={handleBookClick}
              displayedBooks={displayedBooks}
              totalBooks={books.length}
              onLoadMore={handleLoadMore}
              isLoading={isLoading}
              searchQuery={debouncedQuery}
            />

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
    </>
  );
};

export default Index;
