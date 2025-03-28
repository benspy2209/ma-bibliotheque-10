
import { Link } from "react-router-dom";
import { BookText } from "lucide-react";

interface FooterInfoLinksProps {
  className?: string;
}

const FooterInfoLinks = ({ className = "" }: FooterInfoLinksProps) => {
  return (
    <div className={className}>
      <h4 className="font-medium text-base mb-3 flex items-center">
        <BookText className="h-4 w-4 mr-2 text-[#e4364a]" />
        Informations
      </h4>
      <ul className="space-y-2">
        <li>
          <Link to="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Fonctionnalités
          </Link>
        </li>
        <li>
          <Link to="/roadmap" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Roadmap
          </Link>
        </li>
        <li>
          <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            FAQ
          </Link>
        </li>
        <li>
          <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Politique de confidentialité
          </Link>
        </li>
        <li>
          <Link to="/legal-notice" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Mentions légales
          </Link>
        </li>
        <li>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default FooterInfoLinks;
