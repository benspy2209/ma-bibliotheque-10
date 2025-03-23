
import React, { useMemo, useState } from 'react';
import { Book } from '@/types/book';
import { Button } from "@/components/ui/button";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AuthorFilterProps {
  books: Book[];
  selectedAuthor: string | null;
  onAuthorSelect: (author: string | null) => void;
}

export const AuthorFilter = ({ books, selectedAuthor, onAuthorSelect }: AuthorFilterProps) => {
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
    <div className="flex items-center gap-2">
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
          className="h-8 px-2" 
          title="Effacer le filtre"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
