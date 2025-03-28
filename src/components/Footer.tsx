
import { useIsMobile } from "@/hooks/use-mobile";
import MobileFooter from "./footer/MobileFooter";
import DesktopFooter from "./footer/DesktopFooter";

const Footer = () => {
  const isMobile = useIsMobile();
  
  return (
    <footer className="w-full border-t py-6 px-6 mt-auto">
      <div className="container mx-auto max-w-7xl">
        {isMobile ? <MobileFooter /> : <DesktopFooter />}
      </div>
    </footer>
  );
};

export default Footer;
