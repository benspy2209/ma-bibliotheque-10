
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown, ArrowUp, CalendarDays, TextIcon, User } from "lucide-react";

export type SortOption = 'recent' | 'title-asc' | 'title-desc' | 'author-asc' | 'author-desc';

interface SortMenuProps {
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
}

export const SortMenu = ({ sortBy, onSortChange }: SortMenuProps) => {
  const getSortIcon = (option: SortOption) => {
    switch (option) {
      case 'recent':
        return <CalendarDays className="h-4 w-4" />;
      case 'title-asc':
      case 'title-desc':
        return <TextIcon className="h-4 w-4" />;
      case 'author-asc':
      case 'author-desc':
        return <User className="h-4 w-4" />;
    }
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'recent':
        return 'Date de lecture';
      case 'title-asc':
        return 'Titre A → Z';
      case 'title-desc':
        return 'Titre Z → A';
      case 'author-asc':
        return 'Auteur A → Z';
      case 'author-desc':
        return 'Auteur Z → A';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {getSortIcon(sortBy)}
          {getSortLabel(sortBy)}
          {sortBy.endsWith('-asc') ? (
            <ArrowUp className="h-4 w-4" />
          ) : sortBy.endsWith('-desc') ? (
            <ArrowDown className="h-4 w-4" />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={() => onSortChange('recent')} className="gap-2">
          <CalendarDays className="h-4 w-4" />
          Date de lecture
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('title-asc')} className="gap-2">
          <TextIcon className="h-4 w-4" />
          Titre A → Z
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('title-desc')} className="gap-2">
          <TextIcon className="h-4 w-4" />
          Titre Z → A
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('author-asc')} className="gap-2">
          <User className="h-4 w-4" />
          Auteur A → Z
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('author-desc')} className="gap-2">
          <User className="h-4 w-4" />
          Auteur Z → A
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
