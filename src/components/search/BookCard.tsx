
import { Book } from '@/types/book';
import { Card } from "@/components/ui/card";
import { ShoppingCart } from 'lucide-react';
import { getAmazonAffiliateUrl } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  onBookClick: (book: Book) => void;
}

export const BookCard = ({ book, onBookClick }: BookCardProps) => {
  const handleAmazonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation(); // Éviter de déclencher handleBookClick
  };

  return (
    <Card 
      key={book.id} 
      className="book-card group cursor-pointer relative overflow-hidden"
      onClick={() => onBookClick(book)}
    >
      <img
        src={book.cover}
        alt={book.title}
        className="transition-transform duration-300 group-hover:scale-105"
      />
      <div className="book-info">
        <h3 className="text-lg font-semibold dark:text-black">{book.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-800">
          {Array.isArray(book.author) ? book.author[0] : book.author}
        </p>
        <a 
          href={getAmazonAffiliateUrl(book)}
          onClick={handleAmazonClick}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          title="Acheter sur Amazon"
        >
          <ShoppingCart className="h-4 w-4" />
        </a>
      </div>
    </Card>
  );
};
