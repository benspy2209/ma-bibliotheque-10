
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search, Globe } from 'lucide-react';
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

export type SearchLanguage = 'fr' | 'en';

interface SearchBarProps {
  onSearch: (query: string, searchType: SearchType, language: SearchLanguage) => void;
  placeholder?: string;
}

export const SearchBar = ({ onSearch, placeholder = "Rechercher..." }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('general');
  const [language, setLanguage] = useState<SearchLanguage>('fr');
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

  const handleLanguageChange = (value: SearchLanguage) => {
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

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
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
          value={language} 
          onValueChange={(value) => handleLanguageChange(value as SearchLanguage)}
        >
          <SelectTrigger className="w-[180px] h-12">
            <SelectValue placeholder="Langue">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {language === 'fr' ? 'Français' : 'Anglais'}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span>🇫🇷</span> Français
              </div>
            </SelectItem>
            <SelectItem value="en" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span>🇬🇧</span> Anglais
              </div>
            </SelectItem>
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
