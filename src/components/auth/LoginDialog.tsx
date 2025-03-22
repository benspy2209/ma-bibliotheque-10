
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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Bienvenue sur Biblioapp</DialogTitle>
          <DialogDescription className="text-center">
            Connectez-vous ou créez un compte pour gérer votre bibliothèque personnelle
          </DialogDescription>
        </DialogHeader>
        <LoginForm defaultTab={authMode} />
      </DialogContent>
    </Dialog>
  );
}
