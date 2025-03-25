
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search, BookOpen } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ onSearch, placeholder = "Rechercher..." }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signIn, setShowLoginDialog, showLoginDialog } = useSupabaseAuth();
  const { toast } = useToast();

  // Vérifier l'état du dialogue pour debugging
  useEffect(() => {
    console.log("État du dialogue dans SearchBar:", showLoginDialog);
  }, [showLoginDialog]);

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

  // Reproduire EXACTEMENT la même fonction que dans NavBar
  const handleLoginClick = () => {
    console.log("Rejoindre l'aventure button clicked - Reproduisant le comportement du bouton Se connecter");
    // D'abord définir le mode à 'signup'
    signIn('signup');
    // Puis définir explicitement le dialogue à true, dans cet ordre exact
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
        <div className="mt-6 text-center flex flex-col items-center justify-center">
          <p className="text-destructive mb-4">Vous devez vous connecter ou créer un compte pour faire une recherche.</p>
          <Button 
            onClick={handleLoginClick} 
            size="lg" 
            className="flex items-center gap-2 px-8 max-w-xs mx-auto"
          >
            <BookOpen className="h-5 w-5" />
            Rejoindre l'aventure
          </Button>
        </div>
      )}
    </div>
  );
};
