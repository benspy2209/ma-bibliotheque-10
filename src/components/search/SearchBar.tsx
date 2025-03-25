
import { useState, useRef } from 'react';
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
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useSupabaseAuth();
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (!user) {
      // Ne pas effectuer la recherche si l'utilisateur n'est pas connecté
      return;
    }
    
    // Annuler le timeout précédent si existant
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Définir un délai avant d'effectuer la recherche pour éviter les requêtes excessives
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim().length > 2) { // Rechercher seulement si la requête a plus de 2 caractères
        setIsSearching(true);
        onSearch(value, searchType, language)
          .finally(() => {
            setIsSearching(false);
          });
      }
    }, 800); // Délai plus long pour réduire les requêtes API
  };

  const handleSearchTypeChange = (value: SearchType) => {
    setSearchType(value);
    if (searchQuery && searchQuery.trim().length > 2 && user) {
      setIsSearching(true);
      onSearch(searchQuery, value, language)
        .finally(() => {
          setIsSearching(false);
        });
    }
  };

  const handleLanguageChange = (value: LanguageFilter) => {
    setLanguage(value);
    if (searchQuery && searchQuery.trim().length > 2 && user) {
      setIsSearching(true);
      onSearch(searchQuery, searchType, value)
        .finally(() => {
          setIsSearching(false);
        });
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

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter ou créer un compte pour faire une recherche.",
        variant: "destructive"
      });
      return;
    }
    
    if (searchQuery.trim().length > 2) {
      setIsSearching(true);
      onSearch(searchQuery, searchType, language)
        .finally(() => {
          setIsSearching(false);
        });
    } else if (searchQuery.trim().length > 0) {
      toast({
        description: "Veuillez entrer au moins 3 caractères pour la recherche.",
        variant: "default"
      });
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmitSearch} className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-grow">
          <Search className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${isSearching ? 'text-primary animate-pulse' : 'text-gray-400'}`} />
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
        
        <Button 
          type="submit" 
          className="h-12 sm:w-auto"
          disabled={isSearching || !user}
        >
          {isSearching ? 'Recherche...' : 'Rechercher'}
        </Button>
      </form>
      
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
