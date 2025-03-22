
import { BookStatusHandlerProps } from './types';
import { ReadingStatus } from '@/types/book';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function BookStatusHandler({ book, onStatusChange }: BookStatusHandlerProps) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Force une invalidation du cache chaque fois que le statut du livre change
    if (book.status) {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  }, [book.status, queryClient]);
  
  const handleStatusChange = async (status: ReadingStatus) => {
    await onStatusChange(status);
    // Force une invalidation immédiate après le changement
    await queryClient.invalidateQueries({ 
      queryKey: ['books'],
      refetchType: 'all'
    });
  };
  
  return null; // This is a logic-only component, no UI rendering
}
