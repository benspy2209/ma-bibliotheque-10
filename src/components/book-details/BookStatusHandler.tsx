
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
    console.log("BookStatusHandler: Changement de statut du livre à", status);
    console.log("BookStatusHandler: Données actuelles du livre:", book);
    
    // Appeler la fonction de changement de statut
    await onStatusChange(status);
    
    console.log("BookStatusHandler: Statut modifié, invalidation des caches...");
    
    // Forcer une invalidation et un rechargement complet du cache
    await queryClient.resetQueries({
      queryKey: ['books'],
      exact: false
    });
    
    // Attendre que les requêtes soient invalidées
    setTimeout(async () => {
      console.log("BookStatusHandler: Rechargement forcé des données...");
      
      // Recharger explicitement les données
      await queryClient.refetchQueries({ 
        queryKey: ['books'],
        exact: false,
        type: 'all'
      });
      
      // Forcer refetch des statistiques spécifiquement
      await queryClient.refetchQueries({
        queryKey: ['readingGoals'],
        exact: false
      });
      
      // Recharger une deuxième fois après un court délai pour s'assurer que tout est à jour
      setTimeout(async () => {
        console.log("BookStatusHandler: Deuxième rechargement des données...");
        await queryClient.refetchQueries({ 
          queryKey: ['books'],
          exact: false,
          type: 'all'
        });
      }, 500);
      
      console.log("BookStatusHandler: Données rechargées après changement de statut");
    }, 300);
  };
  
  return null; // This is a logic-only component, no UI rendering
}
