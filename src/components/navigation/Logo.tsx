
import { NavLink } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";

interface LogoProps {
  mobile?: boolean;
}

const Logo = ({ mobile = false }: LogoProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={`${mobile ? 'navbar-logo-container' : ''}`}>
      <NavLink to="/" className="flex items-center">
        <img 
          src={theme === 'light' ? "/pulse.png" : "/pulse dark.png"}
          alt="BiblioPulse Logo" 
          className={`h-auto w-auto ${mobile ? 'max-h-[40px]' : 'max-h-[32px] md:max-h-40'}`}
        />
      </NavLink>
    </div>
  );
};

export default Logo;
