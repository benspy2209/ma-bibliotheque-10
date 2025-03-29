
import { Book } from '@/types/book';
import { getAmazonAffiliateUrl } from '@/lib/amazon-utils';
import { ShoppingCart } from "lucide-react";
import { BookDeleteDialog } from './BookDeleteDialog';

interface BookItemProps {
  book: Book;
  isDeleting: boolean;
  onDeleteConfirm: (book: Book) => Promise<void>;
}

export function BookItem({ book, isDeleting, onDeleteConfirm }: BookItemProps) {
  // Generate a fresh Amazon affiliate URL every time
  const amazonUrl = getAmazonAffiliateUrl(book);
  
  const handleAmazonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(amazonUrl, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className="flex gap-4 border-b pb-4">
      <div className="relative w-[80px] h-[120px] shrink-0">
        <img
          src={book.cover || '/placeholder.svg'}
          alt={book.title}
          className="absolute w-full h-full object-cover shadow-md"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </div>
      <div className="flex flex-col flex-grow gap-2">
        <div>
          <h3 className="font-semibold">{book.title}</h3>
          <p className="text-sm text-muted-foreground">
            {Array.isArray(book.author) ? book.author.join(', ') : book.author}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          <a 
            href={amazonUrl}
            onClick={handleAmazonClick}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Acheter sur Amazon
          </a>
          
          <BookDeleteDialog 
            book={book} 
            isDeleting={isDeleting} 
            onDeleteConfirm={onDeleteConfirm}
          />
        </div>
      </div>
    </div>
  );
}
