
import { NavLink } from "react-router-dom";
import { Search, BookOpen, BarChart2, Sun, Moon, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { LoginDialog } from "./auth/LoginDialog";

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const { signIn, signOut, user, showLoginDialog, setShowLoginDialog } = useSupabaseAuth();

  // Fonction wrapper pour gérer le clic du bouton de connexion
  const handleSignIn = () => {
    signIn('login');
  };

  return (
    <nav className="w-full bg-background border-b py-4 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
        <div className="flex items-center gap-8 w-full sm:w-auto order-2 sm:order-1">
          <NavLink 
            to="/" 
            className={({ isActive }) => `flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <BookOpen className="h-4 w-4" />
            Ma Bibliothèque
          </NavLink>
          <NavLink 
            to="/search" 
            className={({ isActive }) => `flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Search className="h-4 w-4" />
            Recherche
          </NavLink>
          <NavLink 
            to="/statistics" 
            className={({ isActive }) => `flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <BarChart2 className="h-4 w-4" />
            Statistiques
          </NavLink>
        </div>
        <div className="flex items-center gap-4 order-1 sm:order-2 sm:ml-auto">
          {user ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={signOut}
              className="transition-colors duration-300"
            >
              Se déconnecter
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSignIn}
              className="transition-colors duration-300"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Se connecter
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="transition-colors duration-300"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </nav>
  );
};

export default NavBar;
