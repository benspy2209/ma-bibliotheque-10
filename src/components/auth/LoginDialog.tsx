
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { authMode } = useSupabaseAuth();
  
  console.log("LoginDialog rendering with authMode:", authMode);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
