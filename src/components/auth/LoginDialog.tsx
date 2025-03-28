
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
import { useNavigate } from "react-router-dom";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { authMode, setAuthMode } = useSupabaseAuth();
  const navigate = useNavigate();
  
  // Si le mode est "reset", rediriger vers la page de réinitialisation du mot de passe
  useEffect(() => {
    if (authMode === 'reset' && open) {
      // Fermer la boîte de dialogue
      onOpenChange(false);
      
      // Rediriger vers la page de réinitialisation du mot de passe
      navigate('/reset-password');
    }
  }, [authMode, open, onOpenChange, navigate]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md max-h-[90vh] overflow-y-auto" 
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
            {authMode === 'reset' && "Nous vous enverrons un lien pour réinitialiser votre mot de passe"}
          </DialogDescription>
        </DialogHeader>
        <LoginForm defaultTab={authMode} />
      </DialogContent>
    </Dialog>
  );
}
