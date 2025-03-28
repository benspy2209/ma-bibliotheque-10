
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface AuthButtonProps {
  user: User | null;
  signOut: () => void;
  handleSignIn: () => void;
}

export const AuthButton = ({ user, signOut, handleSignIn }: AuthButtonProps) => {
  return (
    user ? (
      <Button 
        variant="outline" 
        size="sm"
        onClick={signOut}
        className="transition-colors duration-300 text-base w-full"
      >
        Se déconnecter
      </Button>
    ) : (
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleSignIn}
        className="transition-colors duration-300 text-base w-full"
      >
        <LogIn className="h-5 w-5 mr-2" />
        Se connecter
      </Button>
    )
  );
};
