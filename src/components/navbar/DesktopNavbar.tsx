
import { NavLink } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import { NavLinks } from "./NavLinks";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";
import { Theme } from "@/hooks/use-theme";

interface DesktopNavbarProps {
  user: User | null;
  theme: Theme;
  toggleTheme: () => void;
  getUserDisplayName: () => string;
  getInitials: () => string;
  signOut: () => void;
  handleSignIn: () => void;
}

export const DesktopNavbar = ({
  user,
  theme,
  toggleTheme,
  getUserDisplayName,
  getInitials,
  signOut,
  handleSignIn
}: DesktopNavbarProps) => {
  return (
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
        {/* Menu centré avec espacement réduit */}
        <div className="desktop-menu-container flex-grow">
          <div className="nav-links-container flex items-center justify-center space-x-4">
            <NavLinks />
          </div>
        </div>
        
        {/* Actions utilisateur à droite */}
        <div className="flex items-center gap-3">
          {user ? (
            <UserMenu 
              user={user}
              signOut={signOut}
              getUserDisplayName={getUserDisplayName}
              getInitials={getInitials}
            />
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
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </div>
  );
};
