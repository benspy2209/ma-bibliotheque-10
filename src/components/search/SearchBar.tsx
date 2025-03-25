import { useState, useRef } from 'react';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { SearchType, LanguageFilter } from '@/services/bookSearch';
import { SearchInput } from './SearchInput';
import { SearchTypeSelector } from './SearchTypeSelector';
import { LanguageSelector } from './LanguageSelector';
import { ShowAllResultsButton } from './ShowAllResultsButton';
import { Heart } from 'lucide-react';

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
  const [searchType, setSearchType] = useState<SearchType>('author');
  const [language, setLanguage] = useState<LanguageFilter>('fr');
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user, signIn, setShowLoginDialog, setAuthMode, showLoginDialog } = useSupabaseAuth();
  const { toast } = useToast();

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

  const handleSignInClick = () => {
    console.log("Opening login dialog from SearchBar component");
    setShowLoginDialog(true);
    setAuthMode('signup');
    
    setTimeout(() => {
      if (!showLoginDialog) {
        console.log("Retrying to open login dialog...");
        setShowLoginDialog(true);
      }
    }, 100);
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
          <div className="relative inline-block">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500/50 opacity-75"></span>
            <Button 
              onClick={handleSignInClick}
              className="relative z-10 font-semibold text-base transition-all duration-300 shadow-md hover:shadow-lg pulse-effect flex items-center gap-2"
              variant="pulse"
            >
              <Heart className="h-5 w-5 fill-white" /> Commencez à créer votre bibliothèque !
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
