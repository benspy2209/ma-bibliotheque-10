
import { Link } from "react-router-dom";
import { BookHeart } from "lucide-react";

interface FooterPartnerProps {
  className?: string;
}

const FooterPartner = ({ className = "" }: FooterPartnerProps) => {
  return (
    <div className={className}>
      <h4 className="font-medium text-base mb-3 flex items-center">
        <BookHeart className="h-4 w-4 mr-2 text-[#e4364a]" />
        Partenaire
      </h4>
      <div className="flex flex-col items-center">
        <a 
          href="https://www.brusel.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
          aria-label="Librairie-Galerie Brüsel"
        >
          <img 
            src="/Brusel.webp" 
            alt="Librairie-Galerie Brüsel" 
            className="h-auto max-w-[140px] mb-2"
          />
        </a>
        <p className="text-xs text-muted-foreground text-center mt-1">
          Partenaire officiel pour vos livres et BD
        </p>
      </div>
    </div>
  );
};

export default FooterPartner;
