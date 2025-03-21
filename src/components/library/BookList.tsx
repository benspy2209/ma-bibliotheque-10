
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
                <div className="bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded-full transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <ShoppingCart className="h-4 w-4" />
                </div>
              </a>
            )}
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
              <Badge 
                variant={book.status === 'completed' ? "default" : "secondary"}
              >
                {statusLabels[book.status || 'to-read']}
              </Badge>
              
              {/* Badge "Acheté" pour les livres achetés - display for ALL purchased books */}
              {book.purchased && (
                <Badge 
                  variant="outline" 
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex items-center gap-1"
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
                      className="flex items-center gap-1 cursor-pointer hover:bg-red-600 transition-colors"
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
