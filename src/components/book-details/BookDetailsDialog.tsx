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
import { BookDetailsProps } from './types';
import { BookHeader } from './BookHeader';
import { BookForm } from './BookForm';
import { BookActions } from './BookActions';
import { DeleteBookDialog } from './DeleteBookDialog';

interface BookDetailsDialogProps extends BookDetailsProps {
  onStatusChange: (status: ReadingStatus) => Promise<void>;
  onSaveToLibrary: (bookToSave: Book) => Promise<Book>;
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
  const [currentBook, setCurrentBook] = useState(book);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { toast } = useToast();

  const handleInputChangeInner = (field: keyof Book, value: string) => {
    onInputChange(field, value);
    setCurrentBook(prev => ({
      ...prev,
      [field]: field === 'purchased' ? value === 'true' : 
               (field === 'numberOfPages' || field === 'readingTimeDays') ? 
               (value === '' ? undefined : Number(value)) : value
    }));
  };

  const handleCompletionDateChangeInner = (date: Date | undefined) => {
    onCompletionDateChange(date);
    setCurrentBook(prev => ({
      ...prev,
      completionDate: date ? date.toISOString().split('T')[0] : undefined
    }));
  };

  const handleRatingChangeInner = async (newRating: number) => {
    await onRatingChange(newRating);
    const updatedBook = { ...currentBook, rating: newRating };
    setCurrentBook(updatedBook);
  };

  const handleReviewChangeInner = async (review: { content: string; date: string; } | undefined) => {
    await onReviewChange(review);
    const updatedBook = { ...currentBook, review };
    setCurrentBook(updatedBook);
  };

  const handleStatusChangeInner = async (status: ReadingStatus) => {
    await onStatusChange(status);
    const updatedBook = { ...currentBook, status };
    setCurrentBook(updatedBook);
  };

  const handleSave = async () => {
    await onSaveToLibrary(currentBook);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await onDelete();
      setShowDeleteAlert(false);
      onClose();
      onUpdate();
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
              Informations détaillées sur le livre "{currentBook.title}"
            </DialogDescription>
            <BookHeader
              book={currentBook}
              isEditing={isEditing}
              onEditToggle={() => setIsEditing(!isEditing)}
              onDeleteClick={() => setShowDeleteAlert(true)}
              onStatusChange={handleStatusChangeInner}
            />
          </DialogHeader>
          
          <BookForm
            book={currentBook}
            isEditing={isEditing}
            onInputChange={handleInputChangeInner}
            onDateChange={handleCompletionDateChangeInner}
            onRatingChange={handleRatingChangeInner}
            onReviewChange={handleReviewChangeInner}
          />

          <BookActions isEditing={isEditing} onSave={handleSave} />
        </DialogContent>
      </Dialog>

      <DeleteBookDialog
        book={currentBook}
        isOpen={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
        onConfirmDelete={handleDelete}
      />
    </>
  );
}
