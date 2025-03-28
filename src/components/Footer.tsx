
import { Link } from "react-router-dom";
import { BookOpen, Mail, Heart, Shield, BookText, Facebook } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { toast } from "sonner";

const Footer = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();
  
  const handleHeartClick = () => {
    toast.success("Merci pour votre soutien !", {
      description: "Votre appréciation nous fait chaud au cœur !",
      duration: 2000,
    });
  };
  
  return (
    <footer className="w-full border-t py-6 px-6 mt-auto">
      <div className="container mx-auto max-w-7xl">
        {/* Logo et description */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <div className="flex flex-col sm:flex-row items-center mb-6 sm:mb-0">
            <div className="footer-logo-container mb-3 sm:mb-0">
              <img 
                src={theme === 'light' ? "/pulse.png" : "/pulse dark.png"}
                alt="BiblioPulse Logo" 
                className="h-auto max-h-16 w-auto sm:mr-4" 
              />
            </div>
            <div className="text-center sm:text-left mt-2 sm:mt-0">
              <h3 className="text-lg font-medium">BiblioPulse</h3>
              <p className="text-sm text-muted-foreground max-w-xs mt-1">
                Votre compagnon de lecture personnel pour organiser, suivre et découvrir vos livres.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
            <div>
              <h4 className="font-medium text-base mb-3 flex items-center justify-center sm:justify-start">
                <BookOpen className="h-4 w-4 mr-2 text-[#e4364a]" />
                Navigation
              </h4>
              <ul className="space-y-2">
                <li className="text-center sm:text-left">
                  <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Accueil
                  </Link>
                </li>
                <li className="text-center sm:text-left">
                  <Link to="/library" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Ma Bibliothèque
                  </Link>
                </li>
                <li className="text-center sm:text-left">
                  <Link to="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Recherche
                  </Link>
                </li>
                <li className="text-center sm:text-left">
                  <Link to="/statistics" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Statistiques
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-base mb-3 flex items-center justify-center sm:justify-start">
                <BookText className="h-4 w-4 mr-2 text-[#e4364a]" />
                Informations
              </h4>
              <ul className="space-y-2">
                <li className="text-center sm:text-left">
                  <Link to="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Fonctionnalités
                  </Link>
                </li>
                <li className="text-center sm:text-left">
                  <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Politique de confidentialité
                  </Link>
                </li>
                <li className="text-center sm:text-left">
                  <Link to="/legal-notice" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Mentions légales
                  </Link>
                </li>
                <li className="text-center sm:text-left">
                  <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Séparateur */}
        <div className="border-t border-muted/40 my-4"></div>
        
        {/* Copyright et liens sociaux */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground pt-2">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            © {currentYear} BiblioPulse, réalisé par <a href="https://www.beneloo.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Beneloo.com</a>
          </div>
          
          <div className="flex gap-6">
            <a 
              href="mailto:debruijneb@gmail.com"
              aria-label="Envoyer un email"
              className="hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a 
              href="https://www.facebook.com/BiblioPulse/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-primary transition-colors"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <button 
              className="hover:text-primary transition-colors"
              aria-label="J'aime"
              onClick={handleHeartClick}
            >
              <Heart className="h-4 w-4" />
            </button>
            <a 
              href="/privacy-policy"
              aria-label="Politique de confidentialité" 
              className="hover:text-primary transition-colors"
            >
              <Shield className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
