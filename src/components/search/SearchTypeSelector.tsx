
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, BookText } from 'lucide-react';
import { SearchType } from '@/services/bookSearch';

interface SearchTypeSelectorProps {
  searchType: SearchType;
  onSearchTypeChange: (value: SearchType) => void;
}

export const SearchTypeSelector = ({ 
  searchType, 
  onSearchTypeChange 
}: SearchTypeSelectorProps) => {
  return (
    <Select 
      value={searchType} 
      onValueChange={(value) => onSearchTypeChange(value as SearchType)}
    >
      <SelectTrigger className="w-full sm:w-[180px] h-12">
        <div className="flex items-center gap-2">
          {searchType === 'author' && <User className="h-4 w-4" />}
          {searchType === 'title' && <BookText className="h-4 w-4" />}
          <SelectValue placeholder="Type de recherche" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="title">
          <div className="flex items-center gap-2">
            <BookText className="h-4 w-4" />
            <span>Titre</span>
          </div>
        </SelectItem>
        <SelectItem value="author">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Auteur</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
