
import { NavLink } from "react-router-dom";
import { Search, BookOpen, BarChart2, Sun, Moon, LogIn, Menu, Lightbulb, HelpCircle, User, UserRound, LogOut, Info } from "lucide-react";
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
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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

  // Récupérer le prénom de l'utilisateur ou utiliser son email
  const getUserDisplayName = () => {
    if (!user) return "";
    
    // Si l'utilisateur a un prénom dans les métadonnées
    const firstName = user.user_metadata?.first_name;
    if (firstName) return firstName;
    
    // Vérifier également le nom complet et extraire le prénom
    const fullName = user.user_metadata?.full_name;
    if (fullName && typeof fullName === 'string') {
      const firstNameFromFull = fullName.split(' ')[0];
      if (firstNameFromFull) return firstNameFromFull;
    }
    
    // Sinon, utiliser l'email et extraire la partie avant @
    return user.email ? user.email.split('@')[0] : "Utilisateur";
  };

  // Obtenir les initiales pour l'avatar
  const getInitials = () => {
    if (!user) return "";
    
    const displayName = getUserDisplayName();
    return displayName.substring(0, 2).toUpperCase();
  };

  const NavLinks = () => (
    <>
      <NavLink 
        to="/" 
        className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : theme === 'light' ? 'text-black' : 'text-muted-foreground'}`}
        end
      >
        <BookOpen className="h-4 w-4 text-[#e4364a]" />
        Accueil
      </NavLink>
      <NavLink 
        to="/about" 
        className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : theme === 'light' ? 'text-black' : 'text-muted-foreground'}`}
      >
        <Info className="h-4 w-4 text-[#e4364a]" />
        À propos
      </NavLink>
      <NavLink 
        to="/search" 
        className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : theme === 'light' ? 'text-black' : 'text-muted-foreground'}`}
      >
        <Search className="h-4 w-4 text-[#e4364a]" />
        Recherche
      </NavLink>
      <NavLink 
        to="/library" 
        className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : theme === 'light' ? 'text-black' : 'text-muted-foreground'}`}
      >
        <BookOpen className="h-4 w-4 text-[#e4364a]" />
        Ma Bibliothèque
      </NavLink>
      <NavLink 
        to="/statistics" 
        className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : theme === 'light' ? 'text-black' : 'text-muted-foreground'}`}
      >
        <BarChart2 className="h-4 w-4 text-[#e4364a]" />
        Statistiques
      </NavLink>
      <NavLink 
        to="/features" 
        className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : theme === 'light' ? 'text-black' : 'text-muted-foreground'}`}
      >
        <Lightbulb className="h-4 w-4 text-[#e4364a]" />
        Fonctionnalités
      </NavLink>
      <NavLink 
        to="/faq" 
        className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : theme === 'light' ? 'text-black' : 'text-muted-foreground'}`}
      >
        <HelpCircle className="h-4 w-4 text-[#e4364a]" />
        FAQ
      </NavLink>
    </>
  );

  // Composant pour le menu utilisateur
  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-7 w-7 border border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 z-50">
        <DropdownMenuLabel>
          Connecté en tant que <span className="font-bold">{getUserDisplayName()}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-red-500 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
    <nav className="w-full border-b py-2 px-3 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
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
              
              <div className="flex items-center gap-3">
                {user && (
                  <UserMenu />
                )}
                
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="px-4 py-6">
                    <div className="flex flex-col gap-6">
                      {/* Message de bienvenue en haut du drawer pour les utilisateurs connectés */}
                      {user && (
                        <div className="mb-2 px-2">
                          <p className="text-sm text-muted-foreground">Bonjour, <span className="font-bold text-primary">{getUserDisplayName()}</span></p>
                        </div>
                      )}
                    
                      {/* Bouton Connexion en haut du drawer */}
                      <div className="mb-4 px-2">
                        <AuthButton />
                      </div>
                      
                      <div className="border-t pt-4"></div>
                      
                      {/* Navigation links */}
                      <div className="flex flex-col gap-4">
                        <NavLinks />
                      </div>
                      
                      {/* Thème et fermeture */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleTheme}
                          className="transition-colors duration-300"
                        >
                          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </Button>
                        
                        <DrawerClose asChild>
                          <Button variant="outline" size="sm">Fermer</Button>
                        </DrawerClose>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Nouvelle structure de navigation desktop avec logo centré */}
            <div className="flex flex-col items-center">
              {/* Logo centré */}
              <div className="navbar-logo-container mb-4 flex justify-center">
                <NavLink to="/" className="flex items-center">
                  <img 
                    src={theme === 'light' ? "/pulse.png" : "/pulse dark.png"}
                    alt="BiblioPulse Logo" 
                    className="h-auto w-auto max-h-[60px]" 
                  />
                </NavLink>
              </div>
              
              {/* Conteneur flex avec les liens à gauche et les actions à droite */}
              <div className="w-full flex justify-between items-center">
                {/* Menu centré */}
                <div className="desktop-menu-container flex-grow">
                  <div className="nav-links-container flex items-center justify-center space-x-6">
                    <NavLinks />
                  </div>
                </div>
                
                {/* Actions utilisateur à droite */}
                <div className="flex items-center gap-2">
                  {user ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs mr-1 hidden lg:inline-block">
                        Bonjour, <span className="font-medium text-primary">{getUserDisplayName()}</span>
                      </span>
                      <UserMenu />
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleSignIn}
                      className="transition-colors duration-300 text-sm h-8"
                    >
                      <LogIn className="h-4 w-4 mr-1" />
                      Se connecter
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="transition-colors duration-300 h-8 w-8"
                  >
                    {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </nav>
  );
}

export default NavBar;
