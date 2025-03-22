
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
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface DeleteBookDialogProps {
  book: Book;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => Promise<void>;
}

export function DeleteBookDialog({ book, isOpen, onOpenChange, onConfirmDelete }: DeleteBookDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (isDeleting) return; // Prevent multiple clicks
    
    setIsDeleting(true);
    try {
      console.log('Starting delete operation for book:', book.id);
      await onConfirmDelete();
      console.log('Delete operation completed successfully');
      // onOpenChange(false) will be called by the parent component after successful deletion
    } catch (error) {
      console.error('Error in delete dialog during deletion:', error);
      setIsDeleting(false); // Reset state only on error
      // The dialog will remain open so the user can try again
    }
  };
  
  return (
    <AlertDialog 
      open={isOpen} 
      onOpenChange={(open) => {
        // Don't allow closing the dialog during deletion
        if (isDeleting && !open) return;
        
        // If we're closing the dialog and not in the process of deleting,
        // reset the state
        if (!open && !isDeleting) {
          setIsDeleting(false);
        }
        
        onOpenChange(open);
      }}
    >
      <AlertDialogContent aria-describedby="delete-dialog-description">
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
