
import { Button } from "../ui/button";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  theme: string;
  toggleTheme: () => void;
}

export const ThemeToggle = ({ theme, toggleTheme }: ThemeToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="transition-colors duration-300 h-8 w-8"
    >
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
};
