
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchType } from '@/services/bookSearch';

interface SearchBarProps {
  onSearch: (query: string, searchType: SearchType) => void;
  placeholder?: string;
}

export const SearchBar = ({ onSearch, placeholder = "Rechercher..." }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('general');
  const { user } = useSupabaseAuth();
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (!user) {
      // Ne pas effectuer la recherche si l'utilisateur n'est pas connecté
      return;
    }
    
    const timeoutId = setTimeout(() => {
      onSearch(value, searchType);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSearchTypeChange = (value: SearchType) => {
    setSearchType(value);
    
    // Afficher un conseil pour la recherche par ISBN
    if (value === 'isbn') {
      toast({
        title: "Conseil de recherche",
        description: "Pour les ISBN, essayez avec ou sans tirets (ex: 978-2352949091 ou 9782352949091).",
      });
    }
    
    if (searchQuery && user) {
      onSearch(searchQuery, value);
    }
  };

  const handleInputFocus = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter ou créer un compte pour faire une recherche.",
        variant: "destructive"
      });
    }
  };

  // Modifier le placeholder en fonction du type de recherche
  const getPlaceholder = () => {
    switch (searchType) {
      case 'author':
        return "Nom de l'auteur...";
      case 'title':
        return "Titre du livre...";
      case 'isbn':
        return "Code ISBN (10 ou 13 chiffres)...";
      default:
        return placeholder;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder={getPlaceholder()}
            className="pl-10 h-12"
            value={searchQuery}
            onChange={handleSearch}
            onFocus={handleInputFocus}
          />
        </div>
        <Select 
          value={searchType} 
          onValueChange={(value) => handleSearchTypeChange(value as SearchType)}
        >
          <SelectTrigger className="w-[180px] h-12">
            <SelectValue placeholder="Type de recherche" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">Recherche globale</SelectItem>
            <SelectItem value="author">Par auteur</SelectItem>
            <SelectItem value="title">Par titre</SelectItem>
            <SelectItem value="isbn">Par ISBN</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {!user && (
        <div className="mt-2 text-center">
          <p className="text-destructive">Vous devez vous connecter ou créer un compte pour faire une recherche.</p>
        </div>
      )}
    </div>
  );
};
