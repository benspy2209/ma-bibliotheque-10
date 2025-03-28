
import { useTheme } from "@/hooks/use-theme";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoginDialog } from "./auth/LoginDialog";
import { MobileNavbar } from "./navbar/MobileNavbar";
import { DesktopNavbar } from "./navbar/DesktopNavbar";
import { useUserDisplay } from "./navbar/UserUtils";
import { useEffect, useState } from "react";

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const { signIn, signOut, user, showLoginDialog, setShowLoginDialog, setAuthMode } = useSupabaseAuth();
  const isMobileView = useIsMobile();
  const [isMobile, setIsMobile] = useState(true); // Default to mobile to prevent flicker
  const { getUserDisplayName, getInitials } = useUserDisplay(user);

  // Use effect to track mobile state changes with a slight delay to avoid hydration issues
  useEffect(() => {
    // First render - check if we're definitely on desktop
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsMobile(false);
    }
    
    // Then set based on hook with short delay to avoid flicker
    const timer = setTimeout(() => {
      setIsMobile(isMobileView);
    }, 10);
    
    return () => clearTimeout(timer);
  }, [isMobileView]);

  // Fonction wrapper pour gérer le clic du bouton de connexion
  const handleSignIn = () => {
    console.log("Opening login dialog from NavBar");
    setAuthMode('login');
    setShowLoginDialog(true);
  };

  return (
    <nav className="w-full border-b py-2 px-3 sticky top-0 z-50 bg-background/95 backdrop-blur transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        {isMobile ? (
          <MobileNavbar 
            user={user}
            theme={theme}
            toggleTheme={toggleTheme}
            getUserDisplayName={getUserDisplayName}
            getInitials={getInitials}
            signOut={signOut}
            handleSignIn={handleSignIn}
          />
        ) : (
          <DesktopNavbar 
            user={user}
            theme={theme}
            toggleTheme={toggleTheme}
            getUserDisplayName={getUserDisplayName}
            getInitials={getInitials}
            signOut={signOut}
            handleSignIn={handleSignIn}
          />
        )}
      </div>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </nav>
  );
}

export default NavBar;
