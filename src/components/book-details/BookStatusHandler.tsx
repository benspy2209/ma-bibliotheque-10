
import { BookStatusHandlerProps } from './types';
import { ReadingStatus } from '@/types/book';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function BookStatusHandler({ book, onStatusChange }: BookStatusHandlerProps) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Force une invalidation du cache chaque fois que le statut du livre change
    if (book.status) {
      queryClient.invalidateQueries({ 
        queryKey: ['books'],
        refetchType: 'all',
        exact: false
      });
    }
  }, [book.status, queryClient]);
  
  const handleStatusChange = async (status: ReadingStatus) => {
    await onStatusChange(status);
    
    console.log("Statut modifié, invalidation des caches...");
    
    // Force une invalidation immédiate et complète après le changement
    await queryClient.invalidateQueries({ 
      queryKey: ['books'],
      refetchType: 'all',
      exact: false
    });
    
    console.log("Cache invalidé après changement de statut à:", status);
    
    // Force refetch de toutes les données liées aux livres
    await queryClient.refetchQueries({ 
      queryKey: ['books'],
      exact: false,
      type: 'all'
    });
    
    // Force refetch des statistiques spécifiquement
    await queryClient.refetchQueries({
      queryKey: ['readingGoals'],
      exact: false
    });
    
    console.log("Données rechargées après invalidation du cache");
  };
  
  return null; // This is a logic-only component, no UI rendering
}
