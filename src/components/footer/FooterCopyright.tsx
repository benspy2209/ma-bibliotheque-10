
interface FooterCopyrightProps {
  className?: string;
}

const FooterCopyright = ({ className = "" }: FooterCopyrightProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className={className}>
      © {currentYear} BiblioPulse, réalisé par <a href="https://www.beneloo.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Beneloo.com</a>
    </div>
  );
};

export default FooterCopyright;
