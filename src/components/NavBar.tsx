
import { NavLink } from "react-router-dom";
import { Search, BookOpen, BarChart2, Sun, Moon, LogIn, Menu, Google } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { LoginDialog } from "./auth/LoginDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose
} from "./ui/drawer";

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const { signIn, signOut, signInWithGoogle, user, showLoginDialog, setShowLoginDialog } = useSupabaseAuth();
  const isMobile = useIsMobile();

  // Fonction wrapper pour gérer le clic du bouton de connexion
  const handleSignIn = () => {
    signIn('signup'); // Changed from 'login' to 'signup'
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign in button clicked");
    signInWithGoogle();
  };

  const NavLinks = () => (
    <>
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
    </>
  );

  return (
    <nav className="w-full bg-background border-b py-4 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-4">
        {isMobile ? (
          <div className="flex items-center">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="px-4 py-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    <NavLinks />
                  </div>
                  <DrawerClose asChild>
                    <Button variant="outline" size="sm">Fermer</Button>
                  </DrawerClose>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        ) : (
          <div className="flex items-center gap-8">
            <NavLinks />
          </div>
        )}
        
        <div className="flex items-center gap-4">
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
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignIn}
                className="transition-colors duration-300"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Se connecter
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGoogleSignIn}
                className="transition-colors duration-300"
              >
                <Google className="h-4 w-4 mr-2" />
                Google
              </Button>
            </div>
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
}

export default NavBar;
