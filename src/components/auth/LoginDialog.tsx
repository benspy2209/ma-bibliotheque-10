
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

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { authMode, setAuthMode, resetEmailError } = useSupabaseAuth();
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
  
  // Fix mobile scrolling issues by preventing default touchmove behavior
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      // Allow scrolling inside the dialog content
      if (dialogRef.current?.contains(e.target as Node)) {
        e.stopPropagation();
      }
    };

    // Only add the listeners when the dialog is open
    if (open) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [open]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        ref={dialogRef}
        className="sm:max-w-md max-h-[90vh] overflow-y-auto auth-form-container DialogContent" 
        onPointerDownOutside={(e) => e.preventDefault()} 
        onInteractOutside={(e) => e.preventDefault()}
      >
        <ScrollArea className="h-full pr-4 overflow-y-auto">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
