
import { useState, useEffect } from 'react';
import { Book, ReadingStatus } from '@/types/book';
import { useToast } from '@/hooks/use-toast';
import { BookDetailsProps } from './book-details/types';
import { saveBook } from '@/services/supabaseBooks';
import { BookDetailsDialog } from './book-details/BookDetailsDialog';
import { useQueryClient } from '@tanstack/react-query';
import { getAmazonAffiliateUrl } from '@/lib/amazon-utils';
import { differenceInDays } from 'date-fns';

export function BookDetails({ book, isOpen, onClose, onUpdate }: BookDetailsProps) {
  const [currentBook, setCurrentBook] = useState(book);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Force une actualisation lorsque le composant est monté ou le livre change
    queryClient.invalidateQueries({ queryKey: ['books'] });
    
    // S'assurer que le livre a un lien Amazon correct à chaque ouverture
    if (book && book.id) {
      // Toujours regénérer un lien Amazon frais
      const amazonUrl = getAmazonAffiliateUrl(book);
      setCurrentBook(prev => ({
        ...prev,
        amazonUrl: amazonUrl
      }));
    }
  }, [queryClient, isOpen, book]); 

  // Mettre à jour automatiquement le nombre de jours de lecture si les dates sont disponibles
  useEffect(() => {
    if (currentBook.startReadingDate && currentBook.completionDate && currentBook.status === 'completed') {
      try {
        const startDate = new Date(currentBook.startReadingDate);
        const endDate = new Date(currentBook.completionDate);
        
        // Vérifier que les dates sont valides
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return;
        
        // Calculer la différence en jours (+1 pour inclure le jour de fin)
        const daysDiff = differenceInDays(endDate, startDate) + 1;
        
        // Mettre à jour seulement si la valeur est différente
        if (daysDiff > 0 && daysDiff !== currentBook.readingTimeDays) {
          setCurrentBook(prev => ({
            ...prev,
            readingTimeDays: daysDiff
          }));
        }
      } catch (error) {
        console.error('Erreur lors du calcul des jours de lecture:', error);
      }
    }
  }, [currentBook.startReadingDate, currentBook.completionDate, currentBook.status]);

  const handleStatusChange = async (status: ReadingStatus) => {
    const updatedBook = { ...currentBook, status };
    
    // Si le statut passe à "reading" et qu'il n'y a pas de date de début, on l'ajoute automatiquement
    if (status === 'reading' && !updatedBook.startReadingDate) {
      updatedBook.startReadingDate = new Date().toISOString().split('T')[0];
    }
    
    setCurrentBook(updatedBook);
    await saveToLibrary(updatedBook);
  };

  const saveToLibrary = async (bookToSave: Book) => {
    try {
      // Toujours s'assurer que le livre a un lien Amazon correct avant de le sauvegarder
      const updatedBook = {
        ...bookToSave,
        amazonUrl: getAmazonAffiliateUrl(bookToSave)
      };
      
      console.log('Starting save operation for book:', updatedBook.id, 'with status:', updatedBook.status);
      const result = await saveBook(updatedBook);
      
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
    console.log(`Updating field ${field} with value:`, value);
    
    // Traitement spécial pour les catégories
    if (field === 'subjects') {
      console.log("Processing subjects field with value:", value);
      
      // Logique simplifiée : chaque virgule est un séparateur, on préserve tout le reste
      const subjects = value.split(',')
        .map(subject => subject.trim())
        .filter(subject => subject.length > 0);
      
      console.log("Converted to array:", subjects);
      
      setCurrentBook(prev => ({
        ...prev,
        subjects
      }));
      return;
    }
    
    // Traitement spécial pour l'auteur
    if (field === 'author' && value.includes(',')) {
      const authorArray = value.split(',').map(a => a.trim()).filter(Boolean);
      setCurrentBook(prev => ({
        ...prev,
        author: authorArray
      }));
      return;
    }
    
    // Traitement spécial pour les maisons d'édition
    if (field === 'publishers' && value.trim()) {
      const publishersArray = value.split(',').map(p => p.trim()).filter(Boolean);
      setCurrentBook(prev => ({
        ...prev,
        publishers: publishersArray
      }));
      return;
    }
    
    setCurrentBook(prev => ({
      ...prev,
      [field]: field === 'purchased' ? value === 'true' : 
               (field === 'numberOfPages' || field === 'readingTimeDays') ? 
               (value === '' ? undefined : Number(value)) : value
    }));
  };

  const handleCompletionDateChange = (date: Date | undefined) => {
    console.log('Completion date changed to:', date);
    setCurrentBook(prev => ({
      ...prev,
      completionDate: date ? date.toISOString().split('T')[0] : undefined
    }));
  };
  
  const handleStartReadingDateChange = (date: Date | undefined) => {
    console.log('Start reading date changed to:', date);
    setCurrentBook(prev => ({
      ...prev,
      startReadingDate: date ? date.toISOString().split('T')[0] : undefined
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
      onStartDateChange={handleStartReadingDateChange}
      onRatingChange={handleRatingChange}
      onReviewChange={handleReviewChange}
    />
  );
}
