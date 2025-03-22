
import { useState, useCallback, useEffect } from 'react';
import { Book, ReadingStatus } from '@/types/book';
import { useToast } from '@/hooks/use-toast';
import { BookDetailsProps } from './book-details/types';
import { saveBook } from '@/services/supabaseBooks';
import { BookDetailsDialog } from './book-details/BookDetailsDialog';
import { useQueryClient } from '@tanstack/react-query';

export function BookDetails({ book, isOpen, onClose, onUpdate }: BookDetailsProps) {
  const [currentBook, setCurrentBook] = useState(book);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Force une actualisation lorsque le composant est monté ou le livre change
    queryClient.invalidateQueries({ queryKey: ['books'] });
  }, [queryClient, isOpen]); // S'exécute uniquement lorsque le modal s'ouvre

  const handleStatusChange = async (status: ReadingStatus) => {
    const updatedBook = { ...currentBook, status };
    setCurrentBook(updatedBook);
    await saveToLibrary(updatedBook);
  };

  const saveToLibrary = async (bookToSave: Book) => {
    try {
      console.log('Starting save operation for book:', bookToSave.id, 'with status:', bookToSave.status);
      const result = await saveBook(bookToSave);
      
      if (result.success) {
        // Force une invalidation IMMÉDIATE et COMPLÈTE du cache
        await queryClient.invalidateQueries({ 
          queryKey: ['books'],
          refetchType: 'all',
          exact: false
        });
        
        onUpdate();
        toast({
          description: "Les modifications ont été enregistrées",
        });
        console.log('Save operation completed successfully, cache invalidated');
      } else {
        // Gestion des différents types d'erreurs
        if (result.error === 'duplicate') {
          toast({
            variant: "destructive",
            description: "Ce livre est déjà dans votre bibliothèque",
          });
        } else {
          toast({
            variant: "destructive",
            description: result.message || "Une erreur est survenue lors de la sauvegarde",
          });
        }
      }
    } catch (error) {
      console.error('Error during book save:', error);
      toast({
        variant: "destructive",
        description: "Une erreur est survenue lors de la sauvegarde",
      });
    }
  };

  const handleInputChange = (field: keyof Book, value: string) => {
    setCurrentBook(prev => ({
      ...prev,
      [field]: field === 'purchased' ? value === 'true' : 
               (field === 'numberOfPages' || field === 'readingTimeDays') ? 
               (value === '' ? undefined : Number(value)) : value
    }));
  };

  const handleCompletionDateChange = (date: Date | undefined) => {
    setCurrentBook(prev => ({
      ...prev,
      completionDate: date ? date.toISOString().split('T')[0] : undefined
    }));
  };

  const handleRatingChange = async (newRating: number) => {
    const updatedBook = { ...currentBook, rating: newRating };
    setCurrentBook(updatedBook);
    await saveToLibrary(updatedBook);
  };

  const handleReviewChange = async (review: { content: string; date: string; } | undefined) => {
    const updatedBook = { ...currentBook, review };
    setCurrentBook(updatedBook);
    await saveToLibrary(updatedBook);
  };

  return (
    <BookDetailsDialog
      book={currentBook}
      isOpen={isOpen}
      onClose={() => {
        // Force une actualisation avant la fermeture
        queryClient.invalidateQueries({ queryKey: ['books'] });
        onClose();
      }}
      onUpdate={onUpdate}
      onStatusChange={handleStatusChange}
      onSaveToLibrary={saveToLibrary}
      onInputChange={handleInputChange}
      onCompletionDateChange={handleCompletionDateChange}
      onRatingChange={handleRatingChange}
      onReviewChange={handleReviewChange}
    />
  );
}
