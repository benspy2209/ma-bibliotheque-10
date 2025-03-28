
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

interface ThemeToggleProps {
  showLabel?: boolean;
}

const ThemeToggle = ({ showLabel = false }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size={showLabel ? "sm" : "icon"}
      onClick={toggleTheme}
      className="transition-colors duration-300"
    >
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      {showLabel && (
        <span className="ml-2">{theme === 'light' ? 'Mode sombre' : 'Mode clair'}</span>
      )}
    </Button>
  );
};

export default ThemeToggle;
