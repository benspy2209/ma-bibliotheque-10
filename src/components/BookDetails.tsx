
import { Book, ReadingStatus } from '@/types/book';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BookDetailsProps } from './book-details/types';
import { saveBook, deleteBook } from '@/services/supabaseBooks';
import { BookHeader } from './book-details/BookHeader';
import { BookPreview } from './book-details/BookPreview';
import { BookDescription } from './book-details/BookDescription';
import { DeleteBookDialog } from './book-details/DeleteBookDialog';

export function BookDetails({ book, isOpen, onClose, onUpdate }: BookDetailsProps) {
  const [currentBook, setCurrentBook] = useState(book);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (status: ReadingStatus) => {
    const updatedBook = { ...currentBook, status };
    setCurrentBook(updatedBook);
    await saveToLibrary(updatedBook);
  };

  const handleInputChange = (field: keyof Book, value: string) => {
    setCurrentBook(prev => ({ ...prev, [field]: value }));
  };

  const handleCompletionDateChange = (date: Date | undefined) => {
    setCurrentBook(prev => ({
      ...prev,
      completionDate: date ? date.toISOString().split('T')[0] : undefined
    }));
  };

  const handleRatingChange = async (newRating: number) => {
    const updatedBook = { ...currentBook, rating: newRating };
    setCurrentBook(updatedBook);
    await saveToLibrary(updatedBook);
  };

  const saveToLibrary = async (bookToSave: Book) => {
    try {
      await saveBook(bookToSave);
      onUpdate();
      toast({
        description: "Les modifications ont été enregistrées",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        variant: "destructive",
        description: "Une erreur est survenue lors de la sauvegarde",
      });
    }
  };

  const handleSave = async () => {
    await saveToLibrary(currentBook);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      setShowDeleteAlert(false);
      onClose();

      await deleteBook(currentBook.id);
      
      toast({
        description: "Le livre a été supprimé de votre bibliothèque",
      });

      onUpdate();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <BookHeader
              book={currentBook}
              isEditing={isEditing}
              onEditToggle={() => setIsEditing(!isEditing)}
              onDeleteClick={() => setShowDeleteAlert(true)}
              onStatusChange={handleStatusChange}
            />
          </DialogHeader>
          
          <BookPreview
            book={currentBook}
            isEditing={isEditing}
            onRatingChange={handleRatingChange}
            onInputChange={handleInputChange}
            onDateChange={handleCompletionDateChange}
          />

          <Separator className="my-2" />
          
          <BookDescription
            description={currentBook.description}
            isEditing={isEditing}
            onDescriptionChange={(value) => handleInputChange('description', value)}
          />

          {isEditing && (
            <div className="flex justify-end mt-2">
              <Button onClick={handleSave}>
                Enregistrer les modifications
              </Button>
            </div>
          )}
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
