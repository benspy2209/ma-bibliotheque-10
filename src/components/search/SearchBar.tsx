
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search, BookOpen, User, BookText } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SearchType, LanguageFilter } from '@/services/bookSearch';

interface SearchBarProps {
  onSearch: (query: string, searchType: SearchType, language: LanguageFilter) => void;
  placeholder?: string;
  showAllResults?: () => void;
  hasMoreResults?: boolean;
  totalBooks?: number;
}

export const SearchBar = ({ 
  onSearch, 
  placeholder = "Rechercher...", 
  showAllResults,
  hasMoreResults,
  totalBooks = 0
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('author');
  const [language, setLanguage] = useState<LanguageFilter>('fr');
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
      onSearch(value, searchType, language);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSearchTypeChange = (value: SearchType) => {
    setSearchType(value);
    if (searchQuery && user) {
      onSearch(searchQuery, value, language);
    }
  };

  const handleLanguageChange = (value: LanguageFilter) => {
    setLanguage(value);
    if (searchQuery && user) {
      onSearch(searchQuery, searchType, value);
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

  const handleShowAllResults = () => {
    if (showAllResults) {
      showAllResults();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder={placeholder}
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
          <SelectTrigger className="w-full sm:w-[180px] h-12">
            <div className="flex items-center gap-2">
              {searchType === 'author' && <User className="h-4 w-4" />}
              {searchType === 'title' && <BookText className="h-4 w-4" />}
              {searchType === 'general' && <Search className="h-4 w-4" />}
              <SelectValue placeholder="Type de recherche" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="author">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Auteur</span>
              </div>
            </SelectItem>
            <SelectItem value="title">
              <div className="flex items-center gap-2">
                <BookText className="h-4 w-4" />
                <span>Titre</span>
              </div>
            </SelectItem>
            <SelectItem value="general">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Général</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={language} 
          onValueChange={(value) => handleLanguageChange(value as LanguageFilter)}
        >
          <SelectTrigger className="w-full sm:w-[120px] h-12">
            <SelectValue placeholder="Langue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="en">Anglais</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {hasMoreResults && searchQuery && (
        <div className="flex justify-center mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShowAllResults}
            className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            <BookOpen className="h-4 w-4" />
            Afficher tous les {totalBooks} livres {searchType === 'author' ? 'de l\'auteur' : 'trouvés'}
          </Button>
        </div>
      )}
      
      {!user && (
        <div className="mt-2 text-center">
          <p className="text-destructive">Vous devez vous connecter ou créer un compte pour faire une recherche.</p>
        </div>
      )}
    </div>
  );
};
