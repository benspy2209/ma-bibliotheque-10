
import { Link } from "react-router-dom";
import { Logo } from "./ui/logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t py-4 px-6 mt-auto">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <Logo showTagline={true} size="sm" className="mb-4 md:mb-0" />
          <div className="flex flex-col sm:flex-row gap-4 mt-2 sm:mt-0 items-center">
            <Link 
              to="/contact" 
              className="hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link 
              to="/privacy-policy" 
              className="hover:text-primary transition-colors"
            >
              Politique de confidentialité
            </Link>
            <Link 
              to="/legal-notice" 
              className="hover:text-primary transition-colors"
            >
              Mentions légales
            </Link>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground border-t pt-4">
          © {currentYear} BiblioPulse, réalisé par <a href="https://www.beneloo.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Beneloo.com</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
