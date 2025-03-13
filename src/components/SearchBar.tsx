
import React from 'react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
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
    <div className="relative mx-auto max-w-2xl">
      <Command className="rounded-lg border shadow-md">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder="Rechercher un livre, un auteur..."
            value={searchQuery}
            onValueChange={onSearch}
            className="h-12"
          />
        </div>
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
      </Command>
    </div>
  );
};

export default SearchBar;
