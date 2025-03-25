
import { useState } from 'react';
import { Book } from '@/types/book';
import { getBookDetails } from '@/services/bookDetails';
import { useToast } from "@/hooks/use-toast";

export function useSelectedBook(onUpdate: () => void) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { toast } = useToast();

  const handleBookClick = async (book: Book) => {
    try {
      if (!book || !book.id) {
        toast({
          description: "Impossible d'afficher les détails de ce livre.",
          variant: "destructive"
        });
        return;
      }
      const details = await getBookDetails(book.id, 'fr'); // Default to French language
      setSelectedBook({ ...book, ...details });
    } catch (error) {
      console.error("Erreur lors du chargement des détails:", error);
      toast({
        description: "Erreur lors du chargement des détails du livre.",
        variant: "destructive"
      });
    }
  };

  return {
    selectedBook,
    setSelectedBook,
    handleBookClick,
    onUpdate
  };
}
