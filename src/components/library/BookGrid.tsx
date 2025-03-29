
import { Book } from '@/types/book';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from '../StarRating';
import { ShoppingCart, CheckSquare } from 'lucide-react';
import { getAmazonAffiliateUrl } from '@/lib/amazon-utils';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from '@/hooks/use-theme';

interface BookGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

export const BookGrid = ({ books, onBookClick }: BookGridProps) => {
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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {books.map((book) => {
        // Generate a fresh Amazon affiliate URL for each book
        const amazonUrl = getAmazonAffiliateUrl(book);
        
        return (
          <Card 
            key={book.id}
            className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative group"
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
              <p className="text-xs text-gray-600 dark:text-white/70 line-clamp-1">
                {Array.isArray(book.author) ? book.author[0] : book.author}
              </p>
              {book.rating > 0 && (
                <StarRating rating={book.rating} readonly />
              )}
              <div className="mt-auto space-y-1.5">
                {book.status && (
                  <Badge 
                    className={`block w-fit ${statusColors[book.status].bg} ${statusColors[book.status].text} border-0`}
                  >
                    {statusLabels[book.status]}
                  </Badge>
                )}
                
                {/* Badge "Acheté" pour les livres achetés */}
                {book.purchased && (
                  <Badge 
                    className="bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 flex items-center gap-1 w-fit border-0"
                  >
                    <CheckSquare className="size-3" />
                    Acheté
                  </Badge>
                )}
                
                {(!book.purchased && (!book.status || book.status === 'to-read')) && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Badge 
                        variant="destructive" 
                        className="flex items-center gap-1 w-fit cursor-pointer hover:bg-red-600 transition-colors border-0"
                      >
                        <ShoppingCart className="size-3" />
                        À acheter
                      </Badge>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                      <a 
                        href={amazonUrl}
                        onClick={handleAmazonClick}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Acheter sur Amazon
                      </a>
                    </PopoverContent>
                  </Popover>
                )}
                
                {/* Amazon direct badge - maintenant pour TOUS les livres */}
                <a 
                  href={amazonUrl}
                  onClick={handleAmazonClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge block w-fit flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-full"
                >
                  <ShoppingCart className="size-3" />
                  Amazon
                </a>
                
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
        );
      })}
    </div>
  );
};
