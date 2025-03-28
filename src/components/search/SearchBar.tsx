import { useState, useRef } from 'react';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { SearchType, LanguageFilter } from '@/services/bookSearch';
import { SearchInput } from './SearchInput';
import { SearchTypeSelector } from './SearchTypeSelector';
import { LanguageSelector } from './LanguageSelector';
import { ShowAllResultsButton } from './ShowAllResultsButton';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch: (query: string, searchType: SearchType, language: LanguageFilter) => Promise<void>;
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
  const [searchType, setSearchType] = useState<SearchType>('title');
  const [language, setLanguage] = useState<LanguageFilter>('fr');
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    
    if (!user) {
      return;
    }
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim().length > 2) {
        setIsSearching(true);
        onSearch(value, searchType, language)
          .finally(() => {
            setIsSearching(false);
          });
      }
    }, 800);
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

  const handleJoinAdventure = () => {
    navigate('/library');
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
        <SearchInput 
          searchQuery={searchQuery}
          isSearching={isSearching}
          onInputChange={handleSearch}
          onInputFocus={handleInputFocus}
        />
        
        <SearchTypeSelector 
          searchType={searchType}
          onSearchTypeChange={handleSearchTypeChange}
        />
        
        <LanguageSelector 
          language={language}
          onLanguageChange={handleLanguageChange}
        />
        
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
          <ShowAllResultsButton 
            onShowAllResults={handleShowAllResults}
            totalBooks={totalBooks}
            searchType={searchType}
          />
        </div>
      )}
      
      {!user && (
        <div className="mt-2 text-center">
          <p className="text-destructive mb-4">Vous devez vous connecter ou créer un compte pour faire une recherche.</p>
          <div className="flex justify-center">
            <Button 
              onClick={handleJoinAdventure}
              className="relative z-10 font-semibold text-base transition-all duration-300 shadow-md hover:shadow-lg pulse-effect flex items-center gap-2 bg-[#CC4153] text-white hover:bg-[#b33646]"
              variant="pulse"
            >
              <BookOpen className="h-5 w-5" /> Rejoindre l'aventure
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
