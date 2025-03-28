
import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { Card, CardContent } from "@/components/ui/card";
import { deleteBook } from '@/services/supabaseBooks';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { BooksToBuyHeader } from './books-to-buy/BooksToBuyHeader';
import { AffiliateInfo } from './books-to-buy/AffiliateInfo';
import { BooksList } from './books-to-buy/BooksList';

export function BooksToBuyList() {
  const { user } = useSupabaseAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      fetchBooksToBuy();
    }
  }, [user]);

  const fetchBooksToBuy = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('books')
        .select('book_data')
        .eq('user_id', user?.id)
        .eq('status', 'to-read');
      
      if (error) {
        throw error;
      }
      
      // Transformer les données pour extraire les livres à acheter
      const bookList: Book[] = data
        .map(item => {
          // Handle the Json type safely by using a type guard
          if (typeof item.book_data === 'string') {
            return JSON.parse(item.book_data);
          } else {
            // If it's already an object, return it directly
            return item.book_data as Book;
          }
        })
        .filter(book => !book.purchased);
        
      setBooks(bookList);
    } catch (err: any) {
      console.error('Error fetching books to buy:', err);
      setError(`Erreur lors du chargement des livres: ${err.message || 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBook = async (bookToDelete: Book) => {
    if (!bookToDelete) return;
    
    try {
      setIsDeleting(true);
      
      console.log('Deleting book with ID:', bookToDelete.id);
      await deleteBook(bookToDelete.id);
      
      // Update local state - remove the deleted book from the list
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookToDelete.id));
      
      // Invalidate the books query to refresh any other components using this data
      await queryClient.invalidateQueries({ queryKey: ['books'] });
      
      toast({
        title: "Livre supprimé",
        description: `"${bookToDelete.title}" a été retiré de votre liste d'achats`,
      });
      
      console.log('Book deleted successfully');
    } catch (err: any) {
      console.error('Error deleting book:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de supprimer le livre: ${err.message || 'Erreur inconnue'}`,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full">
      <BooksToBuyHeader />
      <CardContent className="pt-6">
        <AffiliateInfo />
        <BooksList 
          books={books}
          isLoading={isLoading}
          error={error}
          isDeleting={isDeleting}
          onDeleteConfirm={handleDeleteBook}
        />
      </CardContent>
    </Card>
  );
}
