
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookFormProps } from './types';
import { BookPreview } from './BookPreview';
import { BookDescription } from './BookDescription';
import { BookReview } from './BookReview';

export function BookForm({ 
  book, 
  isEditing, 
  onInputChange, 
  onDateChange, 
  onStartDateChange,
  onRatingChange, 
  onReviewChange 
}: BookFormProps) {
  return (
    <>
      <BookPreview
        book={book}
        isEditing={isEditing}
        onRatingChange={onRatingChange}
        onInputChange={onInputChange}
        onDateChange={onDateChange}
        onStartDateChange={onStartDateChange}
      />

      <Separator className="my-4" />

      <Tabs defaultValue="description" className="w-full">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="review">Critique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description">
          <BookDescription
            description={book.description}
            isEditing={isEditing}
            onDescriptionChange={(value) => onInputChange('description', value)}
          />
        </TabsContent>

        <TabsContent value="review">
          <BookReview
            book={book}
            isEditing={isEditing}
            onReviewChange={onReviewChange}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
