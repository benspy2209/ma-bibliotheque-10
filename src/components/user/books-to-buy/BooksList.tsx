
import { Book } from '@/types/book';
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookItem } from './BookItem';

interface BooksListProps {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  isDeleting: boolean;
  onDeleteConfirm: (book: Book) => Promise<void>;
}

export function BooksList({ books, isLoading, error, isDeleting, onDeleteConfirm }: BooksListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p className="text-muted-foreground">Chargement des livres à acheter...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="mb-4" variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun livre à acheter pour le moment.</p>
        <p className="text-sm mt-2">Ajoutez des livres à votre bibliothèque et marquez-les comme "non achetés" pour les voir apparaître ici.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {books.map((book) => (
        <BookItem 
          key={book.id} 
          book={book} 
          isDeleting={isDeleting} 
          onDeleteConfirm={onDeleteConfirm}
        />
      ))}
    </div>
  );
}
