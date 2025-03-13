import { Book, ReadingStatus } from '@/types/book';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator";
import { PenLine, Trash2 } from 'lucide-react';
import { AddToLibrary } from './AddToLibrary';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BookDetailsProps } from './book-details/types';
import { BookMetadata } from './book-details/BookMetadata';
import { CompletionDate } from './book-details/CompletionDate';
import { BookDescription } from './book-details/BookDescription';
import { saveBook, deleteBook } from '@/services/supabaseBooks';
import { StarRating } from './StarRating';

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
      await deleteBook(currentBook.id);
      toast({
        description: "Le livre a été supprimé de votre bibliothèque",
      });
      setShowDeleteAlert(false);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: "destructive",
        description: "Une erreur est survenue lors de la suppression",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <div className="flex justify-between items-center gap-4">
              <DialogTitle className="text-xl font-bold line-clamp-1">{currentBook.title}</DialogTitle>
              <div className="flex gap-2">
                {isEditing && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setShowDeleteAlert(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <PenLine className="h-4 w-4 mr-2" />
                  {isEditing ? "Annuler" : "Éditer"}
                </Button>
              </div>
            </div>
            <DialogDescription className="flex justify-between items-center pt-2">
              <span className="text-sm">Détails du livre</span>
              <AddToLibrary 
                onStatusChange={handleStatusChange}
                currentStatus={currentBook.status}
              />
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-[150px,1fr] gap-4 py-2">
            <img
              src={currentBook.cover}
              alt={currentBook.title}
              className="w-full rounded-lg shadow-lg object-cover h-[200px]"
            />
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <StarRating 
                  rating={currentBook.rating || 0} 
                  onRate={handleRatingChange}
                  readonly={!isEditing}
                />
              </div>
              <BookMetadata
                book={currentBook}
                isEditing={isEditing}
                onInputChange={handleInputChange}
              />
              
              <CompletionDate
                book={currentBook}
                isEditing={isEditing}
                onDateChange={handleCompletionDateChange}
              />
            </div>
          </div>

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

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement le livre "{currentBook.title}" de votre bibliothèque.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
