
import { BookStatusHandlerProps } from './types';
import { ReadingStatus } from '@/types/book';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function BookStatusHandler({ book, onStatusChange }: BookStatusHandlerProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
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
    
    // Si le livre est marqué comme "lu", informer l'utilisateur de mettre à jour les dates de lecture
    if (status === 'completed') {
      toast({
        title: "Livre marqué comme lu",
        description: "N'oubliez pas de mettre à jour les dates de lecture pour des statistiques précises !",
        duration: 6000,
      });
    }
    
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
