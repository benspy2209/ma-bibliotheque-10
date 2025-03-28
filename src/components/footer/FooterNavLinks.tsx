
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

interface FooterNavLinksProps {
  className?: string;
}

const FooterNavLinks = ({ className = "" }: FooterNavLinksProps) => {
  return (
    <div className={className}>
      <h4 className="font-medium text-base mb-3 flex items-center">
        <BookOpen className="h-4 w-4 mr-2 text-[#e4364a]" />
        Navigation
      </h4>
      <ul className="space-y-2">
        <li>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Accueil
          </Link>
        </li>
        <li>
          <Link to="/library" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Ma Bibliothèque
          </Link>
        </li>
        <li>
          <Link to="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Recherche
          </Link>
        </li>
        <li>
          <Link to="/statistics" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Statistiques
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default FooterNavLinks;
