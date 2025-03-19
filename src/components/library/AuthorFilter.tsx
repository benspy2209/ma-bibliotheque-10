
import React, { useMemo } from 'react';
import { Book } from '@/types/book';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            className={cn(
              "w-full md:w-[250px] justify-between",
              selectedAuthor ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {selectedAuthor || "Filtrer par auteur"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full md:w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Rechercher un auteur..." />
            <CommandEmpty>Aucun auteur trouvé.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {authors.map((author) => (
                <CommandItem
                  key={author}
                  value={author}
                  onSelect={() => onAuthorSelect(author)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedAuthor === author ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {author}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
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
