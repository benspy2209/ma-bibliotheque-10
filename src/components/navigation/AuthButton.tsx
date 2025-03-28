
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

interface AuthButtonProps {
  fullWidth?: boolean;
  compact?: boolean;
}

const AuthButton = ({ fullWidth = false, compact = false }: AuthButtonProps) => {
  const { user, signOut, setAuthMode, setShowLoginDialog } = useSupabaseAuth();

  const handleSignIn = () => {
    console.log("Opening login dialog from AuthButton");
    setAuthMode('login');
    setShowLoginDialog(true);
  };

  return user ? (
    <Button 
      variant="outline" 
      size="sm"
      onClick={signOut}
      className={`transition-colors duration-300 text-base ${fullWidth ? 'w-full' : ''}`}
    >
      Se déconnecter
    </Button>
  ) : (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleSignIn}
      className={`transition-colors duration-300 ${compact ? 'text-sm' : 'text-base'} ${fullWidth ? 'w-full' : ''}`}
    >
      <LogIn className={`${compact ? 'h-4 w-4 mr-1' : 'h-5 w-5 mr-2'}`} />
      {compact ? 'Connexion' : 'Se connecter'}
    </Button>
  );
};

export default AuthButton;
