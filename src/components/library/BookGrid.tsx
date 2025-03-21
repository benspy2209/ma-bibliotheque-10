
import { Book } from '@/types/book';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from '../StarRating';
import { ShoppingCart, CheckSquare } from 'lucide-react';
import { getAmazonAffiliateUrl } from '@/lib/utils';
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

  const handleAmazonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation(); // Empêcher le clic de déclencher onBookClick
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {books.map((book) => (
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
            
            {/* Amazon Shopping Cart Overlay on Image Hover */}
            {(!book.purchased && (!book.status || book.status === 'to-read')) && (
              <a 
                href={getAmazonAffiliateUrl(book)}
                onClick={handleAmazonClick}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"
                title="Acheter sur Amazon"
              >
                <div className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <ShoppingCart className="h-6 w-6" />
                </div>
              </a>
            )}
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
              <Badge 
                variant={book.status === 'completed' ? "default" : "secondary"}
                className="block w-fit"
              >
                {statusLabels[book.status || 'to-read']}
              </Badge>
              
              {/* Badge "Acheté" pour les livres achetés */}
              {book.purchased && (
                <Badge 
                  variant="outline" 
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex items-center gap-1 w-fit"
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
                      className="flex items-center gap-1 w-fit cursor-pointer hover:bg-red-600 transition-colors"
                    >
                      <ShoppingCart className="size-3" />
                      À acheter
                    </Badge>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2">
                    <a 
                      href={getAmazonAffiliateUrl(book)}
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
};
