
import { Book } from '@/types/book';
import { BookGrid } from './BookGrid';
import { BookList } from './BookList';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from 'react';

interface BookSectionsProps {
  books: Book[];
  viewMode: 'grid' | 'list';
  onBookClick: (book: Book) => void;
}

export const BookSections = ({ books, viewMode, onBookClick }: BookSectionsProps) => {
  const [purchaseFilter, setPurchaseFilter] = useState<'all' | 'purchased' | 'not-purchased'>('all');
  
  const completedBooks = books.filter(book => book.status === 'completed');
  const readingBooks = books.filter(book => book.status === 'reading');
  const toReadBooks = books.filter(book => !book.status || book.status === 'to-read');

  const filteredToReadBooks = toReadBooks.filter(book => {
    if (purchaseFilter === 'purchased') return book.purchased;
    if (purchaseFilter === 'not-purchased') return !book.purchased;
    return true;
  });

  const BookComponent = viewMode === 'grid' ? BookGrid : BookList;

  return (
    <Tabs defaultValue="reading" className="w-full">
      <TabsList className="mb-8">
        <TabsTrigger value="reading">En cours & Lu ({completedBooks.length + readingBooks.length})</TabsTrigger>
        <TabsTrigger value="to-read">À lire ({toReadBooks.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="reading" className="space-y-8">
        {readingBooks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">En cours de lecture ({readingBooks.length})</h2>
            <BookComponent books={readingBooks} onBookClick={onBookClick} />
          </div>
        )}
        
        {completedBooks.length > 0 && (
          <div>
            {readingBooks.length > 0 && <Separator className="my-8" />}
            <h2 className="text-xl font-semibold mb-4">Livres lus ({completedBooks.length})</h2>
            <BookComponent books={completedBooks} onBookClick={onBookClick} />
          </div>
        )}
      </TabsContent>

      <TabsContent value="to-read">
        <div className="mb-6">
          <Tabs defaultValue="all" className="w-fit" onValueChange={(value) => setPurchaseFilter(value as 'all' | 'purchased' | 'not-purchased')}>
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="purchased">Achetés</TabsTrigger>
              <TabsTrigger value="not-purchased">À acheter</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <BookComponent books={filteredToReadBooks} onBookClick={onBookClick} />
      </TabsContent>
    </Tabs>
  );
};
