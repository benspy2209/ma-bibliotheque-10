
import { Book, ReadingStatus } from '@/types/book';
import { Card } from "@/components/ui/card";
import { ShoppingCart, Check } from 'lucide-react';
import { getAmazonAffiliateUrl } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Badge } from "@/components/ui/badge";
import { AddToLibrary } from '../AddToLibrary';
import { loadBooks, saveBook } from '@/services/supabaseBooks';
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface BookCardProps {
  book: Book;
  onBookClick: (book: Book) => void;
}

export const BookCard = ({ book, onBookClick }: BookCardProps) => {
  const { user } = useSupabaseAuth();
  const [isInLibrary, setIsInLibrary] = useState<boolean>(false);
  const [libraryStatus, setLibraryStatus] = useState<ReadingStatus | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Check if book is already in library
  useEffect(() => {
    if (user) {
      const checkLibraryStatus = async () => {
        const userBooks = await loadBooks();
        const existingBook = userBooks.find(b => 
          (book.sourceId && b.sourceId === book.sourceId) || 
          (b.title === book.title && 
           (Array.isArray(b.author) && Array.isArray(book.author) 
              ? b.author[0] === book.author[0] 
              : b.author === book.author)
          )
        );
        
        if (existingBook) {
          setIsInLibrary(true);
          setLibraryStatus(existingBook.status as ReadingStatus || null);
        } else {
          setIsInLibrary(false);
          setLibraryStatus(null);
        }
      };
      
      checkLibraryStatus();
    }
  }, [book, user]);

  const handleStatusChange = async (status: ReadingStatus) => {
    if (!user) return;
    
    try {
      const bookToSave = {
        ...book,
        status
      };
      
      await saveBook(bookToSave);
      setIsInLibrary(true);
      setLibraryStatus(status);
      
      // Invalidate and refetch the books query to update the UI
      await queryClient.invalidateQueries({ queryKey: ['books'] });
      
      toast({
        description: status === 'to-read' 
          ? "Livre ajouté à votre liste de lecture" 
          : status === 'reading' 
          ? "Livre ajouté à vos lectures en cours" 
          : "Livre marqué comme lu",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Erreur lors de l'ajout du livre à votre bibliothèque",
      });
      console.error("Erreur lors de l'ajout du livre:", error);
    }
  };

  const handleAmazonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation(); // Éviter de déclencher handleBookClick
  };

  const getStatusLabel = (status: ReadingStatus): string => {
    switch (status) {
      case 'to-read': return 'À lire';
      case 'reading': return 'En cours';
      case 'completed': return 'Lu';
      default: return 'À lire';
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent propagation if click is on the badge or button
    if ((e.target as HTMLElement).closest('.library-action')) {
      e.stopPropagation();
      return;
    }
    onBookClick(book);
  };

  return (
    <Card 
      key={book.id} 
      className="book-card group cursor-pointer relative overflow-hidden"
      onClick={handleCardClick}
    >
      <img
        src={book.cover}
        alt={book.title}
        className="transition-transform duration-300 group-hover:scale-105"
      />
      
      {user && (
        <div className="absolute top-2 right-2 z-10 library-action">
          {isInLibrary ? (
            <Badge 
              variant="default" 
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
            >
              <Check className="h-3 w-3" />
              {getStatusLabel(libraryStatus as ReadingStatus)}
            </Badge>
          ) : (
            <AddToLibrary 
              onStatusChange={handleStatusChange}
              bookId={book.id}
              bookTitle={book.title}
              bookAuthor={book.author}
            />
          )}
        </div>
      )}
      
      <div className="book-info">
        <h3 className="text-lg font-semibold dark:text-black">{book.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-800">
          {Array.isArray(book.author) ? book.author[0] : book.author}
        </p>
        <a 
          href={getAmazonAffiliateUrl(book)}
          onClick={handleAmazonClick}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg hover:shadow-amber-500/50 library-action z-10"
          title="Acheter sur Amazon"
        >
          <ShoppingCart className="h-4 w-4" />
        </a>
      </div>
    </Card>
  );
};
