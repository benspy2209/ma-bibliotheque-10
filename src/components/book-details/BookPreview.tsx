
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
  onInputChange: (field: keyof Book, value: string | boolean) => void;
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
    console.log("handleImageUpload called");
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("File read completed");
        const result = reader.result as string;
        console.log("Image data:", result.substring(0, 50) + "...");
        onInputChange('cover', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const fileInput = document.querySelector<HTMLInputElement>('#cover-upload');
    fileInput?.click();
  };

  return (
    <div className="grid grid-cols-[150px,1fr] gap-4 py-2">
      <div className="relative group">
        <img
          src={book.cover || '/placeholder.svg'}
          alt={book.title}
          className="w-full rounded-lg shadow-lg object-cover h-[200px]"
        />
        {isEditing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <input
              id="cover-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-background hover:bg-background/90"
              onClick={triggerFileInput}
            >
              <ImagePlus className="w-4 h-4 mr-1" />
              Changer
            </Button>
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
