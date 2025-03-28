
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UpdatePasswordForm } from "./UpdatePasswordForm";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { authMode, setAuthMode, resetEmailError, hasRecoveryToken } = useSupabaseAuth();
  const location = useLocation();
  const dialogRef = useRef<HTMLDivElement>(null);
  
  // Check if we're on the reset-password page or if we have a hash with recovery token
  useEffect(() => {
    if (location.pathname === "/reset-password" || 
        window.location.hash.includes('type=recovery') ||
        window.location.hash.includes('error=') && window.location.hash.includes('error_code=otp_expired')) {
      setAuthMode('reset');
    }
  }, [location.pathname, setAuthMode]);
  
  // Fix mobile scrolling issues by preventing body scroll
  useEffect(() => {
    // Add body class to prevent scrolling when modal is open
    if (open) {
      document.body.classList.add('modal-open');
      
      // Prevent touchmove on iOS devices
      const handleTouchMove = (e: TouchEvent) => {
        // Allow scrolling inside the dialog content
        if (dialogRef.current?.contains(e.target as Node)) {
          e.stopPropagation();
        } else {
          e.preventDefault();
        }
      };
      
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      
      return () => {
        document.body.classList.remove('modal-open');
        document.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [open]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        ref={dialogRef}
        className="sm:max-w-md max-h-[90vh] auth-form-container DialogContent" 
        onPointerDownOutside={(e) => e.preventDefault()} 
        onInteractOutside={(e) => e.preventDefault()}
      >
        <ScrollArea className="h-full pr-4 overflow-y-auto ScrollArea">
          <DialogHeader>
            <DialogTitle className="text-center">
              {authMode === 'login' && "Connexion à Bibliopulse"}
              {authMode === 'signup' && "Créer un compte Bibliopulse"}
              {authMode === 'reset' && hasRecoveryToken 
                ? "Définir un nouveau mot de passe" 
                : "Réinitialiser votre mot de passe"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {authMode === 'login' && "Accédez à votre bibliothèque personnelle"}
              {authMode === 'signup' && "Inscrivez-vous pour gérer votre bibliothèque personnelle"}
              {authMode === 'reset' && resetEmailError 
                ? "Le lien a expiré, veuillez demander un nouveau lien" 
                : hasRecoveryToken 
                  ? "Entrez votre nouveau mot de passe pour finaliser la réinitialisation" 
                  : "Nous vous enverrons un lien pour réinitialiser votre mot de passe"}
            </DialogDescription>
          </DialogHeader>
          
          {(authMode === 'reset' && hasRecoveryToken) ? (
            <UpdatePasswordForm />
          ) : (
            <LoginForm defaultTab={authMode} />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
