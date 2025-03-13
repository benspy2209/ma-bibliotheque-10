
import { Book } from '@/types/book';
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { PenLine, Trash2 } from 'lucide-react';
import { AddToLibrary } from '../AddToLibrary';
import { ReadingStatus } from '@/types/book';

interface BookHeaderProps {
  book: Book;
  isEditing: boolean;
  onEditToggle: () => void;
  onDeleteClick: () => void;
  onStatusChange: (status: ReadingStatus) => void;
}

export function BookHeader({ 
  book, 
  isEditing, 
  onEditToggle, 
  onDeleteClick,
  onStatusChange 
}: BookHeaderProps) {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <DialogTitle className="text-xl font-bold line-clamp-1">{book.title}</DialogTitle>
        <div className="flex gap-2">
          {isEditing && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={onDeleteClick}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onEditToggle}>
            <PenLine className="h-4 w-4 mr-2" />
            {isEditing ? "Annuler" : "Éditer"}
          </Button>
        </div>
      </div>
      <DialogDescription className="flex justify-between items-center pt-2">
        <span className="text-sm">Détails du livre</span>
        <AddToLibrary 
          onStatusChange={onStatusChange}
          currentStatus={book.status}
        />
      </DialogDescription>
    </>
  );
}
