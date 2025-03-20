
import { Book } from '@/types/book';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from '../StarRating';
import { ShoppingCart } from 'lucide-react';
import { getAmazonAffiliateUrl } from '@/lib/utils';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
              {(!book.purchased && (!book.status || book.status === 'to-read')) && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Badge 
                      variant="destructive" 
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart className="size-3" />
                      À acheter
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-auto p-2">
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
                  </HoverCardContent>
                </HoverCard>
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
