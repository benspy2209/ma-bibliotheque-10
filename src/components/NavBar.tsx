
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { LoginDialog } from "./auth/LoginDialog";
import NavLinks from "./navigation/NavLinks";
import ThemeToggle from "./navigation/ThemeToggle";
import AuthButton from "./navigation/AuthButton";
import MobileMenu from "./navigation/MobileMenu";
import Logo from "./navigation/Logo";

const NavBar = () => {
  const isMobile = useIsMobile();
  const { showLoginDialog, setShowLoginDialog } = useSupabaseAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full border-b py-5 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-4">
        {isMobile ? (
          <>
            {/* Layout mobile amélioré: logo à gauche et menu hamburger à droite */}
            <div className="flex justify-between items-center w-full">
              <Logo mobile={true} />
              
              <div className="flex items-center gap-2">
                <AuthButton compact={true} />
                
                <Button variant="ghost" size="icon" className="ml-2" onClick={() => setMobileMenuOpen(true)}>
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </div>
            </div>
            
            <MobileMenu isOpen={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
          </>
        ) : (
          <>
            <div className="flex items-center gap-6">
              <Logo />
              
              <div className="flex items-center gap-8">
                <NavLinks />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <AuthButton />
              <ThemeToggle />
            </div>
          </>
        )}
      </div>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </nav>
  );
}

export default NavBar;
