
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto py-4 text-center text-xs text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 items-center">
          <Link 
            to="/privacy-policy" 
            className="hover:text-foreground transition-colors"
          >
            Politique de confidentialité
          </Link>
          <span>© {currentYear} Ma Bibliothèque</span>
        </div>
      </div>
    </footer>
  );
};
