
import { Link } from "react-router-dom";
import { Mail, Heart, Shield, Facebook, HelpCircle } from "lucide-react";
import { toast } from "sonner";

const FooterSocialLinks = () => {
  const handleHeartClick = () => {
    toast.success("Merci pour votre soutien !", {
      description: "Votre appréciation nous fait chaud au cœur !",
      duration: 2000,
    });
  };
  
  return (
    <div className="flex gap-4">
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
      <Link 
        to="/faq"
        aria-label="FAQ" 
        className="hover:text-primary transition-colors"
      >
        <HelpCircle className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default FooterSocialLinks;
