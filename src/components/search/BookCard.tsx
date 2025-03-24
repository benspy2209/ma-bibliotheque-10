
import { Book, ReadingStatus } from '@/types/book';
import { Card } from "@/components/ui/card";
import { ShoppingCart, BookmarkPlus, BookOpen, CheckCircle, X } from 'lucide-react';
import { getAmazonAffiliateUrl } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { saveBook } from '@/services/supabaseBooks';
import { useToast } from "@/hooks/use-toast";
import { AddToLibrary } from '@/components/AddToLibrary';
import { useQueryClient } from '@tanstack/react-query';

interface BookCardProps {
  book: Book;
  onBookClick: (book: Book) => void;
}

export const BookCard = ({ book, onBookClick }: BookCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const { user, signIn } = useSupabaseAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAmazonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation(); // Éviter de déclencher handleBookClick
  };

  const handleAddToLibrary = async (status: ReadingStatus) => {
    if (!user) {
      signIn('login');
      return;
    }

    try {
      const updatedBook = { ...book, status };
      const result = await saveBook(updatedBook);
      
      if (!result.success && result.error === 'duplicate') {
        toast({
          description: "Ce livre est déjà dans votre bibliothèque."
        });
      }
      
      // Force une invalidation du cache pour actualiser les données
      await queryClient.invalidateQueries({ 
        queryKey: ['books'],
        refetchType: 'all',
        exact: false
      });
      
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre:", error);
      toast({
        variant: "destructive",
        description: "Erreur lors de l'ajout du livre à votre bibliothèque."
      });
    }
  };

  return (
    <Card 
      key={book.id} 
      className="book-card group cursor-pointer relative overflow-hidden"
      onClick={() => onBookClick(book)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Badge d'ajout à la bibliothèque */}
      <div className="absolute top-2 right-2 z-10">
        <AddToLibrary
          onStatusChange={handleAddToLibrary}
          currentStatus={book.status}
          bookId={book.id}
          bookTitle={book.title}
          bookAuthor={book.author}
        />
      </div>

      <img
        src={book.cover}
        alt={book.title}
        className="transition-transform duration-300 group-hover:scale-105"
      />
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
          className="absolute bottom-2 right-2 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg hover:shadow-amber-500/50"
          title="Acheter sur Amazon"
        >
          <ShoppingCart className="h-4 w-4" />
        </a>
      </div>
    </Card>
  );
};
