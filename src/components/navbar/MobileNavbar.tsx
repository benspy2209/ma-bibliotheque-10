
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { User } from "@supabase/supabase-js";
import { 
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose
} from "../ui/drawer";
import { NavLinks } from "./NavLinks";
import { AuthButton } from "./AuthButton";
import { ThemeToggle } from "./ThemeToggle";
import { Theme } from "@/hooks/use-theme";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface MobileNavbarProps {
  user: User | null;
  theme: Theme;
  toggleTheme: () => void;
  getUserDisplayName: () => string;
  getInitials: () => string;
  signOut: () => void;
  handleSignIn: () => void;
}

export const MobileNavbar = ({
  user,
  theme,
  toggleTheme,
  getUserDisplayName,
  getInitials,
  signOut,
  handleSignIn
}: MobileNavbarProps) => {
  return (
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
        {user && (
          <div className="flex items-center mr-1">
            <Avatar className="h-8 w-8 border-2 border-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        
        <Drawer>
          <DrawerTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative z-50 touch-manipulation"
              aria-label="Menu principal"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="px-4 py-6 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col gap-6">
              {/* Logo en premier dans le drawer */}
              <div className="flex justify-center mb-4">
                <img 
                  src={theme === 'light' ? "/pulse.png" : "/pulse dark.png"}
                  alt="BiblioPulse Logo" 
                  className="h-auto max-h-[60px] w-auto" 
                />
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium">BiblioPulse</h3>
                <p className="text-sm text-muted-foreground">
                  Votre compagnon de lecture personnel pour organiser, suivre et découvrir vos livres.
                </p>
              </div>
              
              {/* Message de bienvenue en haut du drawer pour les utilisateurs connectés */}
              {user && (
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Bonjour, <span className="text-primary">{getUserDisplayName()}</span></p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              )}
            
              {/* Bouton Connexion */}
              <div className="mb-4 px-2">
                <AuthButton user={user} signOut={signOut} handleSignIn={handleSignIn} />
              </div>
              
              <div className="border-t pt-4"></div>
              
              {/* Navigation links */}
              <div className="flex flex-col gap-4">
                <NavLinks />
              </div>
              
              {/* Thème et fermeture */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Thème:</span>
                  <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>
                
                <DrawerClose asChild>
                  <Button variant="outline" size="sm">Fermer</Button>
                </DrawerClose>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
