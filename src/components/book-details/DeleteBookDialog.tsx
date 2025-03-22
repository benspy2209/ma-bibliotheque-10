
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
}

export function DeleteBookDialog({ book, isOpen, onOpenChange, onConfirmDelete }: DeleteBookDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Réinitialiser l'état de suppression quand le dialogue s'ouvre/se ferme
  useEffect(() => {
    if (!isOpen) {
      setIsDeleting(false);
    }
  }, [isOpen]);
  
  const handleDelete = async () => {
    if (isDeleting) return; // Éviter les clics multiples
    
    setIsDeleting(true);
    try {
      await onConfirmDelete();
      // La fermeture du dialogue est maintenant gérée par le composant parent
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    } finally {
      // Ne pas réinitialiser isDeleting ici pour éviter de pouvoir cliquer à nouveau
      // pendant que le composant parent traite la fermeture
    }
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      // Empêcher la fermeture pendant la suppression
      if (isDeleting && !open) return;
      onOpenChange(open);
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
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
