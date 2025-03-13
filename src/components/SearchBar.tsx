
import React from 'react';
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search } from 'lucide-react';
import { Book } from '@/types/book';

interface SearchBarProps {
  searchQuery: string;
  onSearch: (value: string) => void;
  onBookSelect: (book: Book) => void;
  suggestedBooks: Book[];
  isLoading: boolean;
}

const SearchBar = ({
  searchQuery,
  onSearch,
  onBookSelect,
  suggestedBooks,
  isLoading
}: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-xl">
      <Command className="rounded-3xl border shadow-[0_2px_10px] shadow-black/10">
        <div className="flex items-center px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder="Rechercher un livre, un auteur..."
            value={searchQuery}
            onValueChange={onSearch}
            className="h-11 py-3 text-sm bg-transparent focus:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <CommandList>
          {searchQuery && (
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
              {suggestedBooks.map((book) => (
                <CommandItem
                  key={book.id}
                  onSelect={() => onBookSelect(book)}
                  className="flex items-center gap-2 p-2"
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="h-12 w-8 object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{book.title}</span>
                    <span className="text-sm text-gray-500">
                      {Array.isArray(book.author) ? book.author[0] : book.author}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
};

export default SearchBar;
