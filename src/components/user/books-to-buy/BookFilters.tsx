
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Book } from '@/types/book';
import { Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

interface BookFiltersProps {
  books: Book[];
  selectedAuthor: string | null;
  onAuthorSelect: (author: string | null) => void;
  titleFilter: string;
  onTitleFilterChange: (value: string) => void;
}

export function BookFilters({ 
  books, 
  selectedAuthor, 
  onAuthorSelect, 
  titleFilter, 
  onTitleFilterChange 
}: BookFiltersProps) {
  const isMobile = useIsMobile();
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  // Extract unique authors from books
  const authors = Array.from(new Set(
    books.flatMap(book => 
      Array.isArray(book.author) ? book.author : [book.author]
    ).filter(Boolean)
  )).sort();

  const handleClearFilters = () => {
    onAuthorSelect(null);
    onTitleFilterChange('');
  };

  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  const hasActiveFilters = selectedAuthor || titleFilter;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleFilters}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtrer
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
              {(selectedAuthor ? 1 : 0) + (titleFilter ? 1 : 0)}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFilters} 
            className="text-sm"
          >
            <X className="h-4 w-4 mr-1" />
            Effacer les filtres
          </Button>
        )}
      </div>

      {isFiltersVisible && (
        <div className={`space-y-4 p-4 border rounded-md mt-2 bg-background ${isMobile ? 'flex flex-col' : 'grid grid-cols-2 gap-4'}`}>
          <div className="space-y-2">
            <Label htmlFor="titleFilter">Titre</Label>
            <Input
              id="titleFilter"
              placeholder="Filtrer par titre"
              value={titleFilter}
              onChange={(e) => onTitleFilterChange(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="authorFilter">Auteur</Label>
            <Select
              value={selectedAuthor || ""}
              onValueChange={(value) => onAuthorSelect(value || null)}
            >
              <SelectTrigger id="authorFilter" className="w-full">
                <SelectValue placeholder="Tous les auteurs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les auteurs</SelectItem>
                {authors.map((author) => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
