
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search, BarcodeScan } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { isValidISBN } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ onSearch, placeholder = "Rechercher..." }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isValidIsbnInput, setIsValidIsbnInput] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Vérifier si l'entrée est un ISBN valide
    setIsValidIsbnInput(isValidISBN(value));
    
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="relative w-full">
      {isValidIsbnInput ? (
        <BarcodeScan className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
      ) : (
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Input
              type="search"
              placeholder={placeholder}
              className="pl-10 h-12"
              value={searchQuery}
              onChange={handleSearch}
            />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>Recherchez par titre, auteur ou ISBN (10 ou 13 chiffres)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
