
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { authMode, setAuthMode, resetEmailError } = useSupabaseAuth();
  const location = useLocation();
  
  // Check if we're on the reset-password page or if we have a hash with recovery token
  useEffect(() => {
    if (location.pathname === "/reset-password" || 
        window.location.hash.includes('type=recovery') ||
        window.location.hash.includes('error=') && window.location.hash.includes('error_code=otp_expired')) {
      setAuthMode('reset');
    }
  }, [location.pathname, setAuthMode]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md max-h-[90vh] overflow-y-auto auth-form-container" 
        onPointerDownOutside={(e) => e.preventDefault()} 
        onInteractOutside={(e) => e.preventDefault()} 
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            {authMode === 'login' && "Connexion à Bibliopulse"}
            {authMode === 'signup' && "Créer un compte Bibliopulse"}
            {authMode === 'reset' && "Réinitialiser votre mot de passe"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {authMode === 'login' && "Accédez à votre bibliothèque personnelle"}
            {authMode === 'signup' && "Inscrivez-vous pour gérer votre bibliothèque personnelle"}
            {authMode === 'reset' && resetEmailError ? 
              "Le lien a expiré, veuillez demander un nouveau lien" : 
              "Nous vous enverrons un lien pour réinitialiser votre mot de passe"}
          </DialogDescription>
        </DialogHeader>
        <LoginForm defaultTab={authMode} />
      </DialogContent>
    </Dialog>
  );
}
