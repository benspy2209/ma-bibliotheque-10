
import { Book } from '@/types/book';
import { StarRating } from '../StarRating';
import { BookMetadata } from './BookMetadata';
import { CompletionDate } from './CompletionDate';
import { Button } from '../ui/button';
import { ImagePlus } from 'lucide-react';

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
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onInputChange('cover', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-[150px,1fr] gap-4 py-2">
      <div className="relative">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full rounded-lg shadow-lg object-cover h-[200px]"
        />
        {isEditing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button variant="outline" size="sm" className="bg-background/80">
                <ImagePlus className="w-4 h-4 mr-1" />
                Changer
              </Button>
            </label>
          </div>
        )}
      </div>
      
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
