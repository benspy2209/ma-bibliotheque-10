
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search, BookOpen, LogIn } from 'lucide-react';
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

  const handleLoginClick = () => {
    console.log("Rejoindre l'aventure button clicked");
    
    // D'abord définir le mode à 'signup'
    signIn('signup');
    
    // Puis définir explicitement le dialogue à true
    setShowLoginDialog(true);
    
    console.log("État du dialogue après clic:", showLoginDialog);
  };

  const handleConnexionClick = () => {
    console.log("Connexion button clicked");
    
    // Définir le mode à 'login'
    signIn('login');
    
    // Puis définir explicitement le dialogue à true
    setShowLoginDialog(true);
    
    console.log("État du dialogue après clic:", showLoginDialog);
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
          <div className="flex gap-4 flex-wrap justify-center">
            <Button 
              onClick={handleLoginClick} 
              size="lg" 
              className="flex items-center gap-2 px-8"
            >
              <BookOpen className="h-5 w-5" />
              Rejoindre l'aventure
            </Button>
            
            <Button 
              onClick={handleConnexionClick} 
              variant="outline" 
              size="lg" 
              className="flex items-center gap-2 px-8"
            >
              <LogIn className="h-5 w-5" />
              Se connecter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
