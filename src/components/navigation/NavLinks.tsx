
import { NavLink } from "react-router-dom";
import { BookOpen, Search, BarChart2, Lightbulb } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface NavLinksProps {
  mobile?: boolean;
}

const NavLinks = ({ mobile = false }: NavLinksProps) => {
  const { theme } = useTheme();
  
  return (
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
};

export default NavLinks;
