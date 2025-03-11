
import { Book, ReadingStatus } from '@/types/book';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { PenLine } from 'lucide-react';
import { AddToLibrary } from './AddToLibrary';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BookDetailsProps } from './book-details/types';
import { BookMetadata } from './book-details/BookMetadata';
import { CompletionDate } from './book-details/CompletionDate';
import { BookDescription } from './book-details/BookDescription';

export function BookDetails({ book, isOpen, onClose, onUpdate }: BookDetailsProps) {
  const [currentBook, setCurrentBook] = useState(book);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = (status: ReadingStatus) => {
    const updatedBook = { ...currentBook, status };
    setCurrentBook(updatedBook);
    saveToLibrary(updatedBook);
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

  const saveToLibrary = (bookToSave: Book) => {
    const library = JSON.parse(localStorage.getItem('library') || '{}');
    library[bookToSave.id] = bookToSave;
    localStorage.setItem('library', JSON.stringify(library));
    onUpdate();
    toast({
      description: "Les modifications ont été enregistrées",
    });
  };

  const handleSave = () => {
    saveToLibrary(currentBook);
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex justify-between items-center gap-4">
            <DialogTitle className="text-xl font-bold line-clamp-1">{currentBook.title}</DialogTitle>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              <PenLine className="h-4 w-4 mr-2" />
              {isEditing ? "Annuler" : "Éditer"}
            </Button>
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
  );
}
