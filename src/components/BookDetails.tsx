
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
import { BookReview } from './book-details/BookReview';
import { DeleteBookDialog } from './book-details/DeleteBookDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    setCurrentBook(prev => ({
      ...prev,
      [field]: field === 'purchased' ? value === 'true' : 
               (field === 'numberOfPages' || field === 'readingTimeDays') ? 
               (value === '' ? undefined : Number(value)) : value
    }));
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

  const handleReviewChange = async (review: { content: string; date: string; } | undefined) => {
    const updatedBook = { ...currentBook, review };
    setCurrentBook(updatedBook);
    await saveToLibrary(updatedBook);
  };

  const saveToLibrary = async (bookToSave: Book) => {
    try {
      const result = await saveBook(bookToSave);
      
      if (result.success) {
        onUpdate();
        toast({
          description: "Les modifications ont été enregistrées",
        });
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

          <Separator className="my-4" />

          <Tabs defaultValue="description" className="w-full">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="review">Critique</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description">
              <BookDescription
                description={currentBook.description}
                isEditing={isEditing}
                onDescriptionChange={(value) => handleInputChange('description', value)}
              />
            </TabsContent>

            <TabsContent value="review">
              <BookReview
                book={currentBook}
                isEditing={isEditing}
                onReviewChange={handleReviewChange}
              />
            </TabsContent>
          </Tabs>

          {isEditing && (
            <div className="flex justify-end mt-4">
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
