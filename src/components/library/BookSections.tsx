
import { useState } from 'react';
import { Book } from '@/types/book';
import { BookGrid } from '@/components/library/BookGrid';
import { BookList } from '@/components/library/BookList';
import { 
  Tabs, 
  TabsList, 
  TabsContent, 
  TabsTrigger
} from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import { useFilteredBooks } from '@/hooks/use-filtered-books';

interface BookSectionsProps {
  books: Book[];
  viewMode: 'grid' | 'list';
  onBookClick: (book: Book) => void;
  toBuyFilter: boolean | null;
  onToBuyFilterChange: (value: boolean | null) => void;
}

export const BookSections = ({ 
  books, 
  viewMode, 
  onBookClick, 
  toBuyFilter, 
  onToBuyFilterChange 
}: BookSectionsProps) => {
  const isMobile = useIsMobile();
  
  // Liste des livres par catégorie
  const completedBooks = books.filter(book => book.status === 'completed');
  const readingBooks = books.filter(book => book.status === 'reading');
  const toReadBooks = books.filter(book => !book.status || book.status === 'to-read');
  
  // Considérer les livres complétés et en cours de lecture comme achetés
  const purchasedBooks = books.filter(book => book.purchased || book.status === 'completed' || book.status === 'reading');
  const toBuyBooks = books.filter(book => !book.purchased && book.status !== 'completed' && book.status !== 'reading');
  
  const [activeTab, setActiveTab] = useState('all');

  const BookComponent = viewMode === 'grid' ? BookGrid : BookList;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset toBuyFilter when changing tabs unless we're on purchase-specific tabs
    if (value !== 'purchased' && value !== 'to-buy') {
      onToBuyFilterChange(null);
    }
  };

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
      <TabsList className={`mb-8 ${isMobile ? 'flex-col' : 'flex-wrap h-auto justify-start overflow-x-auto'}`}>
        <TabsTrigger 
          value="all" 
          onClick={() => onToBuyFilterChange(null)}
          className="text-xs sm:text-sm"
        >
          Tous ({books.length})
        </TabsTrigger>
        <TabsTrigger 
          value="reading" 
          onClick={() => onToBuyFilterChange(null)}
          className="text-xs sm:text-sm"
        >
          En cours ({readingBooks.length})
        </TabsTrigger>
        <TabsTrigger 
          value="completed" 
          onClick={() => onToBuyFilterChange(null)}
          className="text-xs sm:text-sm"
        >
          Lu ({completedBooks.length})
        </TabsTrigger>
        <TabsTrigger 
          value="to-read" 
          onClick={() => onToBuyFilterChange(null)}
          className="text-xs sm:text-sm"
        >
          À lire ({toReadBooks.length})
        </TabsTrigger>
        <TabsTrigger 
          value="purchased" 
          onClick={() => onToBuyFilterChange(true)}
          className="text-xs sm:text-sm"
        >
          Achetés ({purchasedBooks.length})
        </TabsTrigger>
        <TabsTrigger 
          value="to-buy" 
          onClick={() => onToBuyFilterChange(false)}
          className="text-xs sm:text-sm"
        >
          À acheter ({toBuyBooks.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-8">
        {books.length === 0 ? (
          <p className="text-center text-gray-600 mt-8">
            Votre bibliothèque est vide. Ajoutez des livres depuis la recherche !
          </p>
        ) : (
          <BookComponent books={books} onBookClick={onBookClick} />
        )}
      </TabsContent>

      <TabsContent value="reading" className="space-y-8">
        {readingBooks.length === 0 ? (
          <p className="text-center text-gray-600 mt-8">
            Aucun livre en cours de lecture.
          </p>
        ) : (
          <BookComponent books={readingBooks} onBookClick={onBookClick} />
        )}
      </TabsContent>
      
      <TabsContent value="completed" className="space-y-8">
        {completedBooks.length === 0 ? (
          <p className="text-center text-gray-600 mt-8">
            Aucun livre terminé dans votre bibliothèque.
          </p>
        ) : (
          <BookComponent books={completedBooks} onBookClick={onBookClick} />
        )}
      </TabsContent>

      <TabsContent value="to-read">
        {toReadBooks.length === 0 ? (
          <p className="text-center text-gray-600 mt-8">
            Aucun livre dans votre liste de lecture.
          </p>
        ) : (
          <BookComponent books={toReadBooks} onBookClick={onBookClick} />
        )}
      </TabsContent>
      
      <TabsContent value="purchased">
        {purchasedBooks.length === 0 ? (
          <p className="text-center text-gray-600 mt-8">
            Aucun livre acheté dans votre bibliothèque.
          </p>
        ) : (
          <BookComponent books={purchasedBooks} onBookClick={onBookClick} />
        )}
      </TabsContent>
      
      <TabsContent value="to-buy">
        {toBuyBooks.length === 0 ? (
          <p className="text-center text-gray-600 mt-8">
            Aucun livre à acheter dans votre bibliothèque.
          </p>
        ) : (
          <BookComponent books={toBuyBooks} onBookClick={onBookClick} />
        )}
      </TabsContent>
    </Tabs>
  );
};
