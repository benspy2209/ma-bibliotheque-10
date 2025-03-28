
import { useTheme } from "@/hooks/use-theme";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoginDialog } from "./auth/LoginDialog";
import { MobileNavbar } from "./navbar/MobileNavbar";
import { DesktopNavbar } from "./navbar/DesktopNavbar";
import { useUserDisplay } from "./navbar/UserUtils";

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const { signIn, signOut, user, showLoginDialog, setShowLoginDialog, setAuthMode } = useSupabaseAuth();
  const isMobile = useIsMobile();
  const { getUserDisplayName, getInitials } = useUserDisplay(user);

  // Fonction wrapper pour gérer le clic du bouton de connexion
  const handleSignIn = () => {
    console.log("Opening login dialog from NavBar");
    setAuthMode('login');
    setShowLoginDialog(true);
  };

  return (
    <nav className="w-full border-b py-2 px-3 transition-colors duration-300">
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
