
import { Book } from '@/types/book';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from '../StarRating';
import { ShoppingCart, CheckSquare } from 'lucide-react';
import { getAmazonAffiliateUrl } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from '@/hooks/use-theme';

interface BookListProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

export const BookList = ({ books, onBookClick }: BookListProps) => {
  const { theme } = useTheme();
  
  const statusColors: Record<string, { bg: string, text: string }> = {
    'to-read': {
      bg: theme === 'dark' ? 'bg-blue-500' : 'bg-blue-100',
      text: theme === 'dark' ? 'text-white' : 'text-blue-800'
    },
    'reading': {
      bg: theme === 'dark' ? 'bg-amber-500' : 'bg-amber-100',
      text: theme === 'dark' ? 'text-white' : 'text-amber-800'
    },
    'completed': {
      bg: theme === 'dark' ? 'bg-green-500' : 'bg-green-100',
      text: theme === 'dark' ? 'text-white' : 'text-green-800'
    }
  };
  
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

  const handleAmazonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation(); // Empêcher le clic de déclencher onBookClick
  };

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <Card 
          key={book.id}
          className="flex hover:shadow-lg transition-shadow cursor-pointer animate-fade-in group relative"
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
              <p className="text-sm text-muted-foreground dark:text-white/70">
                {Array.isArray(book.author) ? book.author[0] : book.author}
              </p>
            </div>
            {book.rating > 0 && (
              <StarRating rating={book.rating} readonly />
            )}
            <div className="mt-auto flex gap-2 flex-wrap">
              {book.status && (
                <Badge 
                  className={`${statusColors[book.status].bg} ${statusColors[book.status].text} border-0`}
                >
                  {statusLabels[book.status]}
                </Badge>
              )}
              
              {/* Badge "Acheté" pour les livres achetés */}
              {book.purchased && (
                <Badge 
                  className="bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 flex items-center gap-1 border-0"
                >
                  <CheckSquare className="size-3" />
                  Acheté
                </Badge>
              )}
              
              {(!book.purchased && (!book.status || book.status === 'to-read')) && (
                <a 
                  href={getAmazonAffiliateUrl(book)}
                  onClick={handleAmazonClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-full"
                >
                  <ShoppingCart className="size-3" />
                  Amazon
                </a>
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
}
