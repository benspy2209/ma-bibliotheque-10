
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
import { UserMenu } from "./UserMenu";
import { AuthButton } from "./AuthButton";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

interface MobileNavbarProps {
  user: User | null;
  theme: string;
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
  const [open, setOpen] = useState(false);
  
  // Function to close drawer when a link is clicked
  const handleLinkClick = () => {
    setOpen(false);
  };

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
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="relative z-50">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="px-4 py-6 max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col gap-6">
              {/* Message de bienvenue en haut du drawer pour les utilisateurs connectés */}
              {user && (
                <div className="mb-2 px-2">
                  <p className="text-sm text-muted-foreground">Bonjour, <span className="font-bold text-primary">{getUserDisplayName()}</span></p>
                </div>
              )}
            
              {/* Bouton Connexion en haut du drawer */}
              <div className="mb-4 px-2">
                <AuthButton user={user} signOut={signOut} handleSignIn={handleSignIn} />
              </div>
              
              <div className="border-t pt-4"></div>
              
              {/* Navigation links */}
              <div className="flex flex-col gap-4" onClick={handleLinkClick}>
                <NavLinks />
              </div>
              
              {/* Thème et fermeture */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                
                <DrawerClose asChild>
                  <Button variant="outline" size="sm">Fermer</Button>
                </DrawerClose>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
        
        {user && (
          <UserMenu 
            user={user}
            signOut={signOut}
            getUserDisplayName={getUserDisplayName}
            getInitials={getInitials}
          />
        )}
      </div>
    </div>
  );
};
