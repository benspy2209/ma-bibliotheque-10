
import React, { useMemo } from 'react';
import { Book } from '@/types/book';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from '@/hooks/use-mobile';

interface AuthorFilterProps {
  books: Book[];
  selectedAuthor: string | null;
  onAuthorSelect: (author: string | null) => void;
}

export const AuthorFilter = ({ books, selectedAuthor, onAuthorSelect }: AuthorFilterProps) => {
  const isMobile = useIsMobile();
  
  // Extract unique authors from books
  const authors = useMemo(() => {
    const authorsSet = new Set<string>();
    
    books.forEach(book => {
      if (Array.isArray(book.author)) {
        book.author.forEach(author => {
          if (author) authorsSet.add(author);
        });
      } else if (book.author) {
        authorsSet.add(book.author);
      }
    });
    
    return Array.from(authorsSet).sort();
  }, [books]);
  
  const clearFilter = () => {
    onAuthorSelect(null);
  };

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-2`}>
      <Select
        value={selectedAuthor || ""}
        onValueChange={(value) => onAuthorSelect(value || null)}
      >
        <SelectTrigger 
          className="w-full"
        >
          <SelectValue placeholder="Filtrer par auteur" />
        </SelectTrigger>
        <SelectContent>
          {authors.map((author) => (
            <SelectItem key={author} value={author}>
              {author}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedAuthor && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilter} 
          className={`h-8 px-2 ${isMobile ? 'w-full' : ''}`} 
          title="Effacer le filtre"
        >
          <X className="h-4 w-4 mr-2" />
          Effacer le filtre
        </Button>
      )}
    </div>
  );
};
