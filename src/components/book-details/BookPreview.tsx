
import { Book } from '@/types/book';
import { StarRating } from '../StarRating';
import { BookMetadata } from './BookMetadata';
import { CompletionDate } from './CompletionDate';

interface BookPreviewProps {
  book: Book;
  isEditing: boolean;
  onRatingChange: (rating: number) => void;
  onInputChange: (field: keyof Book, value: string) => void;
  onDateChange: (date: Date | undefined) => void;
}

export function BookPreview({
  book,
  isEditing,
  onRatingChange,
  onInputChange,
  onDateChange
}: BookPreviewProps) {
  return (
    <div className="grid grid-cols-[150px,1fr] gap-4 py-2">
      <img
        src={book.cover}
        alt={book.title}
        className="w-full rounded-lg shadow-lg object-cover h-[200px]"
      />
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <StarRating 
            rating={book.rating || 0} 
            onRate={onRatingChange}
            readonly={!isEditing}
          />
        </div>
        <BookMetadata
          book={book}
          isEditing={isEditing}
          onInputChange={onInputChange}
        />
        
        <CompletionDate
          book={book}
          isEditing={isEditing}
          onDateChange={onDateChange}
        />
      </div>
    </div>
  );
}
