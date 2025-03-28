import { Book } from '@/types/book';
import { BookGrid } from '@/components/search/BookGrid';
import { BookList } from '@/components/search/BookList';
import { BookDetails } from '@/components/BookDetails';
import { useSelectedBook } from '@/hooks/use-selected-book';
import { AddAllBooks } from '@/components/search/AddAllBooks';
import { useToast } from '@/hooks/use-toast';
import { useViewPreference } from '@/hooks/use-view-preference';
import { useEffect } from 'react';
import { Globe } from 'lucide-react';
import { ViewToggle } from './ViewToggle';
import { SearchType, LanguageFilter } from '@/services/bookSearch';

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
  searchType?: SearchType;
  language?: LanguageFilter;
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
  onUpdate,
  searchType = 'title',
  language = 'fr'
}: SearchResultsProps) {
  const { selectedBook, setSelectedBook, handleBookClick } = useSelectedBook(onUpdate);
  const { toast } = useToast();
  const { viewMode, toggleView } = useViewPreference();
  
  useEffect(() => {
    if (books.length === 0 && searchQuery && !isLoading && !searchError) {
      toast({
        title: "Aucun résultat explicite",
        description: "La recherche n'a trouvé aucun résultat correspondant explicitement à votre requête. Si vous cherchez un livre ou une BD, essayez avec un titre exact.",
        duration: 5000,
      });
    }
  }, [books.length, searchQuery, isLoading, searchError, toast]);

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

  const getSearchDescription = () => {
    let searchTypeLabel = "";
    switch (searchType) {
      case 'title':
        searchTypeLabel = "titre";
        break;
      case 'author':
        searchTypeLabel = "auteur";
        break;
      case 'isbn':
        searchTypeLabel = "ISBN";
        break;
      default:
        searchTypeLabel = "titre";
    }

    let languageName = "";
    switch (language) {
      case 'fr':
        languageName = "français";
        break;
      case 'en':
        languageName = "anglais";
        break;
      case 'nl':
        languageName = "néerlandais";
        break;
      case 'es':
        languageName = "espagnol";
        break;
      case 'de':
        languageName = "allemand";
        break;
      case 'pt':
        languageName = "portugais";
        break;
      case 'it':
        languageName = "italien";
        break;
      default:
        languageName = "français";
    }

    return `Résultats incluant livres et BD en ${languageName} par ${searchTypeLabel}`;
  };

  return (
    <>
      {books.length > 0 && searchQuery && (
        <div className="flex flex-col mb-4 space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center text-sm">
                <Globe className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">{getSearchDescription()}</span>
              </div>
              <ViewToggle viewMode={viewMode} onToggle={toggleView} />
            </div>
            <AddAllBooks 
              books={books} 
              onComplete={onUpdate} 
            />
          </div>
        </div>
      )}

      {viewMode === 'grid' ? (
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
      ) : (
        <BookList 
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
      )}

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
