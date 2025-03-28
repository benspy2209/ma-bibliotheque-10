
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

interface AuthButtonProps {
  user: User | null;
  signOut: () => void;
  handleSignIn: () => void;
}

export const AuthButton = ({ user, signOut, handleSignIn }: AuthButtonProps) => {
  if (user) {
    return (
      <Button 
        variant="outline" 
        className="w-full touch-manipulation active:scale-95" 
        onClick={signOut}
        style={{ touchAction: 'manipulation' }}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Déconnexion
      </Button>
    );
  }

  return (
    <Button 
      variant="pulse" 
      className="w-full touch-manipulation active:scale-95" 
      onClick={handleSignIn}
      style={{ touchAction: 'manipulation' }}
    >
      <LogIn className="mr-2 h-4 w-4" />
      Connexion
    </Button>
  );
};
