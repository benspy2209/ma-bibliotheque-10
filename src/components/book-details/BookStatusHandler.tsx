
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBookStatus } from '@/services/supabase'; 
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { addSystemLog } from '@/services/supabaseAdminStats';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { Book } from '@/types/book';

interface BookStatusHandlerProps {
  bookId: string;
}

export function BookStatusHandler({
  bookId,
}: BookStatusHandlerProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useSupabaseAuth();
  
  // Get book data from the existing state to access its title
  const book = queryClient.getQueryData<Book>(['book', bookId]);

  const mutation = useMutation({
    mutationFn: updateBookStatus,
    onSuccess: () => {
      // Fixed invalidation format for @tanstack/react-query v5
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
    },
  });

  const handleUpdateStatus = async (bookId: string, status: string) => {
    mutation.mutate({ bookId, status });
  };

  const updateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await handleUpdateStatus(bookId, newStatus);
      
      // Log status change
      const bookTitle = book?.title || 'Livre inconnu';
      addSystemLog(
        'success', 
        `Statut du livre "${bookTitle}" changé en "${newStatus}"`, 
        user?.id,
        '/library'
      );
      
      // Refresh book details and book list
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      
      let toastMessage = "";
      if (newStatus === 'to-read') {
        toastMessage = "Livre ajouté à votre liste de lecture";
      } else if (newStatus === 'reading') {
        toastMessage = "Livre ajouté à vos lectures en cours";
      } else {
        toastMessage = "Livre marqué comme lu";
      }
      
      toast(toastMessage);
      
    } catch (error) {
      // En cas d'erreur, rétablir le statut précédent
      console.error("Erreur lors de l'ajout du livre:", error);
      
      toast(error instanceof Error 
        ? error.message 
        : "Une erreur est survenue lors de l'ajout du livre"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        className={`${book.status === 'to-read' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''}`}
        onClick={() => updateStatus('to-read')}
        disabled={isUpdating}
      >
        {isUpdating && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        {book.status === 'to-read' ? '✅' : ''} A lire
      </Button>
      <Button
        variant="outline"
        className={`${book.status === 'reading' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''}`}
        onClick={() => updateStatus('reading')}
        disabled={isUpdating}
      >
        {isUpdating && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        {book.status === 'reading' ? '✅' : ''} En cours
      </Button>
      <Button
        variant="outline"
        className={`${book.status === 'completed' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''}`}
        onClick={() => updateStatus('completed')}
        disabled={isUpdating}
      >
        {isUpdating && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        {book.status === 'completed' ? '✅' : ''} Terminé
      </Button>
    </div>
  );
}
