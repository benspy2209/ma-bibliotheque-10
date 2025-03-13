
import { NavLink } from "react-router-dom";
import { Search, BookOpen, BarChart2, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "@/hooks/use-theme";

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="w-full bg-background border-b py-4 px-6 transition-colors duration-300">
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
            Ma Bibliothèque
          </NavLink>
          <NavLink 
            to="/statistics" 
            className={({ isActive }) => `flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <BarChart2 className="h-4 w-4" />
            Statistiques
          </NavLink>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="transition-colors duration-300"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
