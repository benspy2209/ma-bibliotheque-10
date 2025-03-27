
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t py-6 px-6 mt-auto">
      <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center text-base text-muted-foreground">
        <div>
          © {currentYear} BiblioPulse, réalisé par <a href="https://www.beneloo.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Beneloo.com</a>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-3 sm:mt-0 items-center">
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
    </footer>
  );
};

export default Footer;
