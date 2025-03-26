
import { useMemo } from 'react';
import { Book } from '@/types/book';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Calendar } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface YearlyBooksListProps {
  books: Book[];
  selectedYear: number | null;
}

export function YearlyBooksList({ books, selectedYear }: YearlyBooksListProps) {
  const filteredBooks = useMemo(() => {
    if (!selectedYear) return [];
    
    return books
      .filter(book => {
        if (!book.completionDate) return false;
        const completionYear = new Date(book.completionDate).getFullYear();
        return completionYear === selectedYear;
      })
      .sort((a, b) => {
        // Trier par date de complétion (du plus récent au plus ancien)
        if (a.completionDate && b.completionDate) {
          return new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime();
        }
        return 0;
      });
  }, [books, selectedYear]);

  if (!selectedYear || filteredBooks.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center mb-4">
        <Calendar className="h-5 w-5 mr-2 text-primary" />
        <h3 className="font-semibold text-lg">Livres lus en {selectedYear}</h3>
        <span className="ml-2 text-sm text-muted-foreground">({filteredBooks.length} livres)</span>
      </div>
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {filteredBooks.map(book => (
            <div key={book.id} className="flex items-start gap-3 pb-3 border-b">
              <Avatar className="h-14 w-14 rounded-md">
                {book.cover ? (
                  <AvatarImage src={book.cover} alt={book.title} />
                ) : (
                  <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                    <BookOpen className="h-6 w-6" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-1">
                <p className="font-medium leading-none">{book.title}</p>
                <p className="text-sm text-muted-foreground">
                  {Array.isArray(book.author) ? book.author[0] : book.author}
                </p>
                {book.completionDate && (
                  <p className="text-xs text-muted-foreground">
                    Terminé le {format(new Date(book.completionDate), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                )}
                {book.numberOfPages && (
                  <p className="text-xs text-muted-foreground">
                    {book.numberOfPages} pages
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
