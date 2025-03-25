
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ onSearch, placeholder = "Rechercher..." }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signIn, setShowLoginDialog } = useSupabaseAuth();
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (!user) {
      // Ne pas effectuer la recherche si l'utilisateur n'est pas connecté
      return;
    }
    
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, 500);

    return () => clearTimeout(timeoutId);
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

  const handleConnectClick = () => {
    console.log("Ouverture du formulaire de connexion");
    signIn('signup');
    setShowLoginDialog(true);
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-10 h-12"
        value={searchQuery}
        onChange={handleSearch}
        onFocus={handleInputFocus}
      />
      
      {!user && (
        <div className="mt-2 text-center">
          <p className="text-destructive mb-2">Vous devez vous connecter ou créer un compte pour faire une recherche.</p>
          <Button 
            onClick={handleConnectClick} 
            variant="outline"
            className="text-sm"
          >
            Se connecter / Créer un compte
          </Button>
        </div>
      )}
    </div>
  );
};
