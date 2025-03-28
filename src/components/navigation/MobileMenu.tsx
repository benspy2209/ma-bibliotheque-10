
import { NavLink } from "react-router-dom";
import { BookOpen, BookText, Info, Lightbulb } from "lucide-react";
import { 
  Drawer,
  DrawerContent,
  DrawerClose
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import ThemeToggle from "./ThemeToggle";
import AuthButton from "./AuthButton";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileMenu = ({ isOpen, onOpenChange }: MobileMenuProps) => {
  const { theme } = useTheme();
  const { user } = useSupabaseAuth();
  
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
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
                <BookOpen className="h-4 w-4 text-[#e4364a]" />
                Recherche
              </NavLink>
              <NavLink 
                to="/statistics" 
                className={({ isActive }) => `flex items-center gap-2 py-1 text-base transition-colors hover:text-primary ${isActive ? 'text-primary' : ''}`}
              >
                <BookOpen className="h-4 w-4 text-[#e4364a]" />
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
              <ThemeToggle showLabel={true} />
              
              <DrawerClose asChild>
                <Button variant="outline" size="sm">Fermer</Button>
              </DrawerClose>
            </div>
            
            {user && (
              <div className="mt-4">
                <AuthButton fullWidth={true} />
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
