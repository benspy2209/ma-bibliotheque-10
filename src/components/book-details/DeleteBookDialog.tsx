
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
    setIsDeleting(true);
    try {
      await onConfirmDelete();
      // La fermeture sera gérée par le composant parent
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      setIsDeleting(false); // Réinitialiser uniquement en cas d'erreur
    }
  };
  
  return (
    <AlertDialog 
      open={isOpen} 
      onOpenChange={(open) => {
        // Ne pas permettre la fermeture pendant la suppression
        if (isDeleting && !open) return;
        
        // Si on ferme le dialogue et qu'on n'est pas en train de supprimer, 
        // réinitialiser l'état
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
