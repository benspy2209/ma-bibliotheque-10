
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t py-4 px-6 mt-auto">
      <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
        <div>
          © {currentYear} Ma Bibliothèque
        </div>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <Link 
            to="/privacy-policy" 
            className="hover:text-primary transition-colors"
          >
            Politique de confidentialité
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
