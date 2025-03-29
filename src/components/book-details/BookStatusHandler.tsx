import React, { useState } from 'react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBookStatus } from '@/services/supabase';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useBook } from '@/hooks/use-book';
import { addSystemLog } from '@/services/supabaseAdminStats';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

interface BookStatusHandlerProps {
  bookId: string;
}

export function BookStatusHandler({
  bookId,
}: BookStatusHandlerProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();
  const { book } = useBook(bookId);
  const { user } = useSupabaseAuth();

  const mutation = useMutation(updateBookStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
      queryClient.invalidateQueries(['book', bookId]);
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
      queryClient.invalidateQueries(['book', bookId]);
      queryClient.invalidateQueries(['books']);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut :', error);
      toast.error('Impossible de mettre à jour le statut du livre');
      
      // Log error
      addSystemLog(
        'error', 
        `Erreur lors de la mise à jour du statut: ${error instanceof Error ? error.message : 'Erreur inconnue'}`, 
        user?.id,
        '/library'
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
