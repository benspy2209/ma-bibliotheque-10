
import { useState } from 'react';
import { Book, ReadingStatus } from '@/types/book';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { BookHeader } from './BookHeader';
import { BookForm } from './BookForm';
import { BookActions } from './BookActions';
import { DeleteBookDialog } from './DeleteBookDialog';

interface BookDetailsDialogProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onStatusChange: (status: ReadingStatus) => Promise<void>;
  onSaveToLibrary: (bookToSave: Book) => Promise<void>;
  onInputChange: (field: keyof Book, value: string) => void;
  onCompletionDateChange: (date: Date | undefined) => void;
  onRatingChange: (newRating: number) => Promise<void>;
  onReviewChange: (review: { content: string; date: string; } | undefined) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function BookDetailsDialog({ 
  book, 
  isOpen, 
  onClose, 
  onUpdate,
  onStatusChange,
  onSaveToLibrary,
  onInputChange,
  onCompletionDateChange,
  onRatingChange,
  onReviewChange,
  onDelete
}: BookDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    await onSaveToLibrary(book);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await onDelete();
      setShowDeleteAlert(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression",
      });
      setShowDeleteAlert(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="max-w-2xl max-h-[80vh] overflow-y-auto" 
          aria-describedby="book-details-description"
        >
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl">Détails du livre</DialogTitle>
            <DialogDescription id="book-details-description" className="sr-only">
              Informations détaillées sur le livre "{book.title}"
            </DialogDescription>
            <BookHeader
              book={book}
              isEditing={isEditing}
              onEditToggle={() => setIsEditing(!isEditing)}
              onDeleteClick={() => setShowDeleteAlert(true)}
              onStatusChange={onStatusChange}
            />
          </DialogHeader>
          
          <BookForm
            book={book}
            isEditing={isEditing}
            onInputChange={onInputChange}
            onDateChange={onCompletionDateChange}
            onRatingChange={onRatingChange}
            onReviewChange={onReviewChange}
          />

          <BookActions isEditing={isEditing} onSave={handleSave} />
        </DialogContent>
      </Dialog>

      <DeleteBookDialog
        book={book}
        isOpen={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
        onConfirmDelete={handleDelete}
      />
    </>
  );
}
