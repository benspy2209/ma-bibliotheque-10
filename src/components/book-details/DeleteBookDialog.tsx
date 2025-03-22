
import { Book } from '@/types/book';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface DeleteBookDialogProps {
  book: Book;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => Promise<void>;
  isDeleting?: boolean; // État provenant du composant parent
}

export function DeleteBookDialog({ 
  book, 
  isOpen, 
  onOpenChange, 
  onConfirmDelete,
  isDeleting: externalIsDeleting 
}: DeleteBookDialogProps) {
  const [internalIsDeleting, setInternalIsDeleting] = useState(false);
  
  // Combiner l'état externe et interne pour assurer la synchronisation
  const isDeleting = externalIsDeleting || internalIsDeleting;
  
  // Reset l'état interne quand le dialogue se ferme
  useEffect(() => {
    if (!isOpen) {
      setInternalIsDeleting(false);
    }
  }, [isOpen]);
  
  const handleDelete = async () => {
    if (isDeleting) return; // Prevent multiple clicks
    
    setInternalIsDeleting(true);
    try {
      console.log('Starting delete operation for book:', book.id);
      await onConfirmDelete();
      console.log('Delete operation completed successfully');
      
      // Fermer explicitement la boîte de dialogue après la suppression réussie
      onOpenChange(false);
    } catch (error) {
      console.error('Error in delete dialog during deletion:', error);
      setInternalIsDeleting(false); // Reset only on error
    }
  };
  
  return (
    <AlertDialog 
      open={isOpen} 
      onOpenChange={(open) => {
        // Don't allow closing the dialog during deletion
        if (isDeleting && !open) return;
        onOpenChange(open);
      }}
    >
      <AlertDialogContent 
        aria-describedby="delete-dialog-description"
        className="max-w-md"
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription id="delete-dialog-description">
            Cette action supprimera définitivement le livre "{book.title}" de votre bibliothèque.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
