
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
import { DeleteButton } from './DeleteButton';
import { useIsMobile } from '@/hooks/use-mobile';

interface BookDetailsDialogProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onStatusChange: (status: ReadingStatus) => Promise<void>;
  onSaveToLibrary: (bookToSave: Book) => Promise<void>;
  onInputChange: (field: keyof Book, value: string) => void;
  onCompletionDateChange: (date: Date | undefined) => void;
  onStartDateChange: (date: Date | undefined) => void;
  onRatingChange: (newRating: number) => Promise<void>;
  onReviewChange: (review: { content: string; date: string; } | undefined) => Promise<void>;
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
  onStartDateChange,
  onRatingChange,
  onReviewChange
}: BookDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSave = async () => {
    await onSaveToLibrary(book);
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`${isMobile ? 'w-[95vw] p-3' : 'max-w-2xl p-6'} max-h-[90vh] overflow-y-auto`}
        aria-describedby="book-details-description"
      >
        <DialogHeader className="pb-2">
          <DialogTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>Détails du livre</DialogTitle>
          <DialogDescription id="book-details-description" className="sr-only">
            Informations détaillées sur le livre "{book.title}"
          </DialogDescription>
          <BookHeader
            book={book}
            isEditing={isEditing}
            onEditToggle={() => setIsEditing(!isEditing)}
            onStatusChange={onStatusChange}
          />
        </DialogHeader>
        
        <BookForm
          book={book}
          isEditing={isEditing}
          onInputChange={onInputChange}
          onDateChange={onCompletionDateChange}
          onStartDateChange={onStartDateChange}
          onRatingChange={onRatingChange}
          onReviewChange={onReviewChange}
        />

        <div className="flex justify-between mt-4">
          {isEditing ? (
            <BookActions isEditing={isEditing} onSave={handleSave} />
          ) : (
            <div></div>
          )}
          
          <DeleteButton 
            book={book} 
            onDeleteSuccess={onUpdate} 
            onClose={onClose} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
