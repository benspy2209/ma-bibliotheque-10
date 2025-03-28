
import { NavLink } from "react-router-dom";
import { Search, BookOpen, BarChart2, Sun, Moon, LogIn, Menu, Lightbulb, BookText, Info } from "lucide-react";
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
  const { signIn, signOut, user, showLoginDialog, setShowLoginDialog, setAuthMode } = useSupabaseAuth();
  const isMobile = useIsMobile();

  // Fonction wrapper pour gérer le clic du bouton de connexion
  const handleSignIn = () => {
    console.log("Opening login dialog from NavBar");
    setAuthMode('login');
    setShowLoginDialog(true);
  };

  const NavLinks = ({ mobile = false }) => (
    <>
      <NavLink 
        to="/" 
        className={({ isActive }) => `flex items-center gap-2 text-base font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : theme === 'light' ? 'text-black' : 'text-muted-foreground'}`}
        end
      >
        <BookOpen className="h-5 w-5 text-[#e4364a]" />
        Accueil
      </NavLink>
      <NavLink 
        to="/library" 
        className={({ isActive }) => `flex items-center gap-2 text-base font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : theme === 'light' ? 'text-black' : 'text-muted-foreground'}`}
      >
        <BookOpen className="h-5 w-5 text-[#e4364a]" />
        Ma Bibliothèque
      </NavLink>
      <NavLink 
        to="/search" 
        className={({ isActive }) => `flex items-center gap-2 text-base font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : theme === 'light' ? 'text-black' : 'text-muted-foreground'}`}
      >
        <Search className="h-5 w-5 text-[#e4364a]" />
        Recherche
      </NavLink>
      <NavLink 
        to="/statistics" 
        className={({ isActive }) => `flex items-center gap-2 text-base font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : theme === 'light' ? 'text-black' : 'text-muted-foreground'}`}
      >
        <BarChart2 className="h-5 w-5 text-[#e4364a]" />
        Statistiques
      </NavLink>
      <NavLink 
        to="/features" 
        className={({ isActive }) => `flex items-center gap-2 text-base font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : theme === 'light' ? 'text-black' : 'text-muted-foreground'}`}
      >
        <Lightbulb className="h-5 w-5 text-[#e4364a]" />
        Fonctionnalités
      </NavLink>
    </>
  );

  // Afficher le bouton de connexion/déconnexion
  const AuthButton = () => (
    user ? (
      <Button 
        variant="outline" 
        size="sm"
        onClick={signOut}
        className="transition-colors duration-300 text-base w-full"
      >
        Se déconnecter
      </Button>
    ) : (
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleSignIn}
        className="transition-colors duration-300 text-base w-full"
      >
        <LogIn className="h-5 w-5 mr-2" />
        Se connecter
      </Button>
    )
  );

  return (
    <nav className="w-full border-b py-5 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-4">
        {isMobile ? (
          <>
            {/* Layout mobile amélioré: logo à gauche et menu hamburger à droite */}
            <div className="flex justify-between items-center w-full">
              <div className="navbar-logo-container">
                <NavLink to="/" className="flex items-center">
                  <img 
                    src={theme === 'light' ? "/pulse.png" : "/pulse dark.png"}
                    alt="BiblioPulse Logo" 
                    className="h-auto w-auto max-h-[40px]" 
                  />
                </NavLink>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignIn}
                  className="transition-colors duration-300 text-sm"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Connexion
                </Button>
                
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-2">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="mobile-drawer-content">
                    <div className="flex flex-col h-full px-6 py-4">
                      {/* Logo en haut */}
                      <div className="flex justify-center mb-6">
                        <NavLink to="/" className="flex items-center navbar-logo-container">
                          <img 
                            src={theme === 'light' ? "/pulse.png" : "/pulse dark.png"}
                            alt="BiblioPulse Logo" 
                            className="h-auto w-auto max-h-12" 
                          />
                        </NavLink>
                      </div>
                      
                      {/* Section Navigation */}
                      <div className="mobile-nav-section">
                        <div className="mobile-nav-section-title">
                          <BookText className="h-4 w-4 text-[#e4364a]" />
                          Navigation
                        </div>
                        <div className="mobile-nav-links">
                          <NavLink 
                            to="/" 
                            className={({ isActive }) => `flex items-center gap-2 py-1 text-base transition-colors hover:text-primary ${isActive ? 'text-primary' : ''}`}
                            end
                          >
                            <BookOpen className="h-4 w-4 text-[#e4364a]" />
                            Accueil
                          </NavLink>
                          <NavLink 
                            to="/library" 
                            className={({ isActive }) => `flex items-center gap-2 py-1 text-base transition-colors hover:text-primary ${isActive ? 'text-primary' : ''}`}
                          >
                            <BookOpen className="h-4 w-4 text-[#e4364a]" />
                            Ma Bibliothèque
                          </NavLink>
                          <NavLink 
                            to="/search" 
                            className={({ isActive }) => `flex items-center gap-2 py-1 text-base transition-colors hover:text-primary ${isActive ? 'text-primary' : ''}`}
                          >
                            <Search className="h-4 w-4 text-[#e4364a]" />
                            Recherche
                          </NavLink>
                          <NavLink 
                            to="/statistics" 
                            className={({ isActive }) => `flex items-center gap-2 py-1 text-base transition-colors hover:text-primary ${isActive ? 'text-primary' : ''}`}
                          >
                            <BarChart2 className="h-4 w-4 text-[#e4364a]" />
                            Statistiques
                          </NavLink>
                        </div>
                      </div>
                      
                      {/* Section Informations */}
                      <div className="mobile-nav-section">
                        <div className="mobile-nav-section-title">
                          <Info className="h-4 w-4 text-[#e4364a]" />
                          Informations
                        </div>
                        <div className="mobile-nav-links">
                          <NavLink 
                            to="/features" 
                            className={({ isActive }) => `flex items-center gap-2 py-1 text-base transition-colors hover:text-primary ${isActive ? 'text-primary' : ''}`}
                          >
                            <Lightbulb className="h-4 w-4 text-[#e4364a]" />
                            Fonctionnalités
                          </NavLink>
                          <NavLink 
                            to="/privacy-policy" 
                            className={({ isActive }) => `flex items-center gap-2 py-1 text-base transition-colors hover:text-primary ${isActive ? 'text-primary' : ''}`}
                          >
                            <Lightbulb className="h-4 w-4 text-[#e4364a]" />
                            Politique de confidentialité
                          </NavLink>
                          <NavLink 
                            to="/legal-notice" 
                            className={({ isActive }) => `flex items-center gap-2 py-1 text-base transition-colors hover:text-primary ${isActive ? 'text-primary' : ''}`}
                          >
                            <Lightbulb className="h-4 w-4 text-[#e4364a]" />
                            Mentions légales
                          </NavLink>
                          <NavLink 
                            to="/contact" 
                            className={({ isActive }) => `flex items-center gap-2 py-1 text-base transition-colors hover:text-primary ${isActive ? 'text-primary' : ''}`}
                          >
                            <Lightbulb className="h-4 w-4 text-[#e4364a]" />
                            Contact
                          </NavLink>
                        </div>
                      </div>
                      
                      {/* Pied de page mobile */}
                      <div className="mobile-footer mt-auto pt-4">
                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleTheme}
                            className="transition-colors duration-300"
                          >
                            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            <span className="ml-2">{theme === 'light' ? 'Mode sombre' : 'Mode clair'}</span>
                          </Button>
                          
                          <DrawerClose asChild>
                            <Button variant="outline" size="sm">Fermer</Button>
                          </DrawerClose>
                        </div>
                        
                        {user && (
                          <div className="mt-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={signOut}
                              className="transition-colors duration-300 text-base w-full"
                            >
                              Se déconnecter
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-6">
              <NavLink to="/" className="flex items-center navbar-logo-container">
                <img 
                  src={theme === 'light' ? "/pulse.png" : "/pulse dark.png"}
                  alt="BiblioPulse Logo" 
                  className="h-auto w-auto max-h-[32px] md:max-h-40" 
                />
              </NavLink>
              
              <div className="flex items-center gap-8">
                <NavLinks />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={signOut}
                  className="transition-colors duration-300 text-base"
                >
                  Se déconnecter
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignIn}
                  className="transition-colors duration-300 text-base"
                >
                  <LogIn className="h-5 w-5 mr-2" />
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
          </>
        )}
      </div>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </nav>
  );
}

export default NavBar;
