
import { NavLink } from "react-router-dom";
import { Search, BookOpen, BarChart2 } from "lucide-react";

const NavBar = () => {
  return (
    <nav className="w-full bg-background border-b py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <NavLink 
            to="/" 
            className={({ isActive }) => `flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Search className="h-4 w-4" />
            Recherche
          </NavLink>
          <NavLink 
            to="/library" 
            className={({ isActive }) => `flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <BookOpen className="h-4 w-4" />
            Bibliothèque
          </NavLink>
          <NavLink 
            to="/statistics" 
            className={({ isActive }) => `flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <BarChart2 className="h-4 w-4" />
            Statistiques
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
