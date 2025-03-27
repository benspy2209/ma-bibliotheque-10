import { NavLink } from "react-router-dom";
import { Search, BookOpen, BarChart2, Sun, Moon, LogIn, Menu, Lightbulb } from "lucide-react";
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
import { Logo } from "./ui/logo";

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const { signIn, signOut, user, showLoginDialog, setShowLoginDialog } = useSupabaseAuth();
  const isMobile = useIsMobile();

  const handleSignIn = () => {
    signIn('signup');
  };

  const NavLinks = () => (
    <>
      <NavLink 
        to="/" 
        className={({ isActive }) => `flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
        end
      >
        <BookOpen className="h-4 w-4" />
        Accueil
      </NavLink>
      <NavLink 
        to="/library" 
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
      <NavLink 
        to="/features" 
        className={({ isActive }) => `flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
      >
        <Lightbulb className="h-4 w-4" />
        Fonctionnalités
      </NavLink>
    </>
  );

  return (
    <nav className="w-full bg-background border-b py-6 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {isMobile ? (
            <>
              <Logo size="md" showTagline={false} />
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
            </>
          ) : (
            <>
              <NavLink to="/" className="mr-6">
                <Logo size="lg" />
              </NavLink>
              <div className="flex items-center gap-8">
                <NavLinks />
              </div>
            </>
          )}
        </div>
        
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
}

export default NavBar;
