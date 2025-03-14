
import { Book } from '@/types/book';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from '../StarRating';
import { ShoppingCart } from 'lucide-react';

interface BookListProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

export const BookList = ({ books, onBookClick }: BookListProps) => {
  const statusLabels: Record<string, string> = {
    'to-read': 'À lire',
    'reading': 'En cours',
    'completed': 'Lu'
  };

  const formatCompletionDate = (date: string) => {
    return new Intl.DateTimeFormat('fr-FR', { 
      month: 'long',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <Card 
          key={book.id}
          className="flex hover:shadow-lg transition-shadow cursor-pointer animate-fade-in"
          onClick={() => onBookClick(book)}
        >
          <div className="relative w-[100px] h-[150px] shrink-0">
            <img
              src={book.cover || '/placeholder.svg'}
              alt={book.title}
              className="absolute w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
          <div className="flex flex-col flex-grow p-4 gap-2">
            <div>
              <h3 className="font-semibold text-lg">{book.title}</h3>
              <p className="text-sm text-muted-foreground">
                {Array.isArray(book.author) ? book.author[0] : book.author}
              </p>
            </div>
            {book.rating > 0 && (
              <StarRating rating={book.rating} readonly />
            )}
            <div className="mt-auto flex gap-2 flex-wrap">
              <Badge 
                variant={book.status === 'completed' ? "default" : "secondary"}
              >
                {statusLabels[book.status || 'to-read']}
              </Badge>
              {(!book.purchased && (!book.status || book.status === 'to-read')) && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <ShoppingCart className="size-3" />
                  À acheter
                </Badge>
              )}
              {book.status === 'completed' && book.completionDate && (
                <Badge variant="outline" className="bg-muted/50">
                  Lu en {formatCompletionDate(book.completionDate)}
                </Badge>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
