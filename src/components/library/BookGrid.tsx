
import { Book } from '@/types/book';
import { Card } from "@/components/ui/card";

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
    return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date(date));
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {books.map((book) => (
        <Card 
          key={book.id}
          className="book-card group cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onBookClick(book)}
        >
          <img
            src={book.cover || '/placeholder.svg'}
            alt={book.title}
            className="w-full h-[160px] object-cover rounded-t-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          <div className="p-2">
            <h3 className="font-semibold text-sm line-clamp-1">{book.title}</h3>
            <p className="text-xs text-gray-600 line-clamp-1">
              {Array.isArray(book.author) ? book.author[0] : book.author}
            </p>
            <div className="flex flex-col gap-1 mt-1">
              <span className="inline-block text-xs px-2 py-0.5 bg-secondary rounded-full">
                {statusLabels[book.status || 'to-read']}
              </span>
              {book.completionDate && (
                <span className="text-xs text-gray-500">
                  Lu en {formatCompletionDate(book.completionDate)}
                </span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
