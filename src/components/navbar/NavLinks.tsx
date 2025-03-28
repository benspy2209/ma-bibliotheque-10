
import { NavLink } from "react-router-dom";
import { Search, BookOpen, BarChart2, Lightbulb, HelpCircle, Info } from "lucide-react";

export const NavLinks = () => {
  return (
    <>
      <NavLink 
        to="/" 
        className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-current'}`}
        end
      >
        <BookOpen className="h-4 w-4 text-[#e4364a]" />
        Accueil
      </NavLink>
      <NavLink 
        to="/about" 
        className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-current'}`}
      >
        <Info className="h-4 w-4 text-[#e4364a]" />
        À propos
      </NavLink>
      <NavLink 
        to="/search" 
        className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-current'}`}
      >
        <Search className="h-4 w-4 text-[#e4364a]" />
        Recherche
      </NavLink>
      <NavLink 
        to="/library" 
        className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-current'}`}
      >
        <BookOpen className="h-4 w-4 text-[#e4364a]" />
        Ma Bibliothèque
      </NavLink>
      <NavLink 
        to="/statistics" 
        className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-current'}`}
      >
        <BarChart2 className="h-4 w-4 text-[#e4364a]" />
        Statistiques
      </NavLink>
      <NavLink 
        to="/features" 
        className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-current'}`}
      >
        <Lightbulb className="h-4 w-4 text-[#e4364a]" />
        Fonctionnalités
      </NavLink>
      <NavLink 
        to="/faq" 
        className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-current'}`}
      >
        <HelpCircle className="h-4 w-4 text-[#e4364a]" />
        FAQ
      </NavLink>
    </>
  );
};
