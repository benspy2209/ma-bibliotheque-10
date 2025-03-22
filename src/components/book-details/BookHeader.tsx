
import { useState } from 'react';
import { Book, ReadingStatus } from '@/types/book';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddToLibrary } from '@/components/AddToLibrary';
import { Badge } from '@/components/ui/badge';

interface BookHeaderProps {
  book: Book;
  isEditing: boolean;
  onEditToggle: () => void;
  onStatusChange: (status: ReadingStatus) => void;
}

export function BookHeader({ 
  book, 
  isEditing, 
  onEditToggle, 
  onStatusChange 
}: BookHeaderProps) {
  const [titleInput, setTitleInput] = useState(book.title);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleInput(e.target.value);
  };

  const statusBadgeColor = {
    'to-read': 'bg-blue-500',
    'reading': 'bg-amber-500',
    'completed': 'bg-green-500',
  }[book.status as ReadingStatus] || '';

  return (
    <div className="space-y-2">
      {isEditing ? (
        <input
          type="text"
          value={titleInput}
          onChange={handleTitleChange}
          className="text-2xl font-bold w-full focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 py-1"
        />
      ) : (
        <h2 className="text-2xl font-bold">{book.title}</h2>
      )}
      
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {Array.isArray(book.author) ? book.author.join(', ') : book.author || 'Auteur inconnu'}
        </p>
        
        <div className="flex items-center gap-2">
          {book.status && (
            <Badge variant="secondary" className={statusBadgeColor}>
              {book.status === 'to-read' ? 'À lire' : 
               book.status === 'reading' ? 'En cours' : 'Lu'}
            </Badge>
          )}
          
          <AddToLibrary 
            onStatusChange={onStatusChange}
            currentStatus={book.status}
            bookId={book.id}
            bookTitle={book.title}
            bookAuthor={book.author}
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onEditToggle}
            title={isEditing ? "Terminer l'édition" : "Modifier"}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
