
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
  const isMobile = useIsMobile();
  
  // Filtres de base pour les différentes catégories
  const completedBooks = books.filter(book => book.status === 'completed');
  const readingBooks = books.filter(book => book.status === 'reading');
  const toReadBooks = books.filter(book => !book.status || book.status === 'to-read');
  
  // Livres achetés (purchased === true)
  const purchasedBooks = books.filter(book => book.purchased === true);
  
  // Livres à acheter (purchased === false) - indépendant du statut de lecture
  const toBuyBooks = books.filter(book => book.purchased === false);

  const BookComponent = viewMode === 'grid' ? BookGrid : BookList;

  // Déterminer quels livres afficher en fonction de l'onglet sélectionné
  const handleTabClick = (tabValue: string) => {
    // Si l'utilisateur sélectionne l'onglet "to-buy", on applique le filtre
    if (tabValue === "to-buy") {
      onToBuyFilterChange(true);
    } else {
      // Sinon, on réinitialise le filtre
      onToBuyFilterChange(null);
    }
  };

  return (
    <Tabs 
      defaultValue="all" 
      onValueChange={handleTabClick}
      className="w-full"
    >
      <TabsList className={`mb-8 ${isMobile ? 'flex-col' : 'flex-wrap h-auto justify-start overflow-x-auto'}`}>
        <TabsTrigger 
          value="all" 
          className="text-xs sm:text-sm"
        >
          Tous ({books.length})
        </TabsTrigger>
        <TabsTrigger 
          value="reading" 
          className="text-xs sm:text-sm"
        >
          En cours ({readingBooks.length})
        </TabsTrigger>
        <TabsTrigger 
          value="completed" 
          className="text-xs sm:text-sm"
        >
          Lu ({completedBooks.length})
        </TabsTrigger>
        <TabsTrigger 
          value="to-read" 
          className="text-xs sm:text-sm"
        >
          À lire ({toReadBooks.length})
        </TabsTrigger>
        <TabsTrigger 
          value="purchased" 
          className="text-xs sm:text-sm"
        >
          Achetés ({purchasedBooks.length})
        </TabsTrigger>
        <TabsTrigger 
          value="to-buy" 
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

      <TabsContent value="to-read">
        {toReadBooks.length === 0 ? (
          <p className="text-center text-gray-600 mt-8">
            Aucun livre dans votre liste de lecture.
          </p>
        ) : (
          <BookComponent books={toReadBooks} onBookClick={onBookClick} />
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
