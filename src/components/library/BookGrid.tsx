
import { Book } from '@/types/book';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from '../StarRating';

interface BookGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

export const BookGrid = ({ books, onBookClick }: BookGridProps) => {
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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {books.map((book) => (
        <Card 
          key={book.id}
          className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onBookClick(book)}
        >
          <div className="relative w-full h-[200px]">
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
          <div className="flex flex-col flex-grow p-3 space-y-2">
            <h3 className="font-semibold text-sm line-clamp-1">{book.title}</h3>
            <p className="text-xs text-gray-600 line-clamp-1">
              {Array.isArray(book.author) ? book.author[0] : book.author}
            </p>
            {book.rating > 0 && (
              <StarRating rating={book.rating} readonly />
            )}
            <div className="mt-auto space-y-1.5">
              <Badge 
                variant={book.status === 'completed' ? "default" : "secondary"}
                className="block w-fit"
              >
                {statusLabels[book.status || 'to-read']}
              </Badge>
              {book.status === 'completed' && book.completionDate && (
                <Badge 
                  variant="outline" 
                  className="block w-fit bg-muted/50"
                >
                  Lu en {formatCompletionDate(book.completionDate)}
                </Badge>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
