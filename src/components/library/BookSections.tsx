
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
  const [purchaseFilter, setPurchaseFilter] = useState<'all' | 'purchased' | 'not-purchased'>('all');
  const isMobile = useIsMobile();
  
  const completedBooks = books.filter(book => book.status === 'completed');
  const readingBooks = books.filter(book => book.status === 'reading');
  const toReadBooks = books.filter(book => !book.status || book.status === 'to-read');
  const toBuyBooks = books.filter(book => !book.purchased && (!book.status || book.status === 'to-read'));
  const purchasedBooks = books.filter(book => book.purchased === true);

  const filteredToReadBooks = toReadBooks.filter(book => {
    if (purchaseFilter === 'purchased') return book.purchased;
    if (purchaseFilter === 'not-purchased') return !book.purchased;
    return true;
  });

  const BookComponent = viewMode === 'grid' ? BookGrid : BookList;

  return (
    <Tabs defaultValue="all" className="w-full">
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
          onClick={() => onToBuyFilterChange(null)}
          className="text-xs sm:text-sm"
        >
          Achetés ({purchasedBooks.length})
        </TabsTrigger>
        <TabsTrigger 
          value="to-buy" 
          onClick={() => onToBuyFilterChange(true)}
          className="bg-destructive/10 hover:bg-destructive/20 data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground text-xs sm:text-sm"
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

      <TabsContent value="purchased" className="space-y-8">
        {purchasedBooks.length === 0 ? (
          <p className="text-center text-gray-600 mt-8">
            Aucun livre acheté dans votre bibliothèque.
          </p>
        ) : (
          <BookComponent books={purchasedBooks} onBookClick={onBookClick} />
        )}
      </TabsContent>

      <TabsContent value="to-read">
        <div className="mb-6">
          <Tabs defaultValue="all" className="w-fit" onValueChange={(value) => setPurchaseFilter(value as 'all' | 'purchased' | 'not-purchased')}>
            <TabsList className={isMobile ? 'flex-col w-full' : ''}>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="purchased">Achetés</TabsTrigger>
              <TabsTrigger value="not-purchased">À acheter</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {filteredToReadBooks.length === 0 ? (
          <p className="text-center text-gray-600 mt-8">
            {purchaseFilter !== 'all' 
              ? `Aucun livre ${purchaseFilter === 'purchased' ? 'acheté' : 'à acheter'} dans votre liste de lecture.`
              : "Aucun livre dans votre liste de lecture."}
          </p>
        ) : (
          <BookComponent books={filteredToReadBooks} onBookClick={onBookClick} />
        )}
      </TabsContent>

      <TabsContent value="to-buy" className="space-y-8">
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
