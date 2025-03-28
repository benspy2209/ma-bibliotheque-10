
import { useTheme } from "@/hooks/use-theme";

interface FooterLogoProps {
  isMobile: boolean;
}

const FooterLogo = ({ isMobile }: FooterLogoProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={`footer-logo-container ${isMobile ? 'flex justify-center mb-3' : ''}`}>
      <img 
        src={theme === 'light' ? "/pulse.png" : "/pulse dark.png"}
        alt="BiblioPulse Logo" 
        className={`h-auto ${isMobile ? 'max-h-16' : 'max-h-12'} w-auto ${!isMobile ? 'mr-4' : ''}`} 
      />
    </div>
  );
};

export default FooterLogo;
