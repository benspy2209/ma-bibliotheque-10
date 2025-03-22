
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ResetPasswordForm } from '../ResetPasswordForm';

interface LoginTabProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function LoginTab({ isLoading, setIsLoading }: LoginTabProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const { toast } = useToast();
  const { setAuthMode } = useSupabaseAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast({
        description: "Connexion réussie"
      });
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
      toast({
        variant: "destructive",
        description: `Erreur : ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default button behavior
    console.log("Ouverture du dialogue de réinitialisation du mot de passe");
    setShowResetDialog(true);
  };

  return (
    <>
      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
        <div className="space-y-2">
          <Label htmlFor="email-login">Email</Label>
          <Input
            id="email-login"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="votre@email.com"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password-login">Mot de passe</Label>
          <Input
            id="password-login"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            disabled={isLoading}
          />
          <div className="text-right">
            <Button 
              type="button" 
              variant="link" 
              className="p-0 h-auto text-xs cursor-pointer" 
              onClick={handleForgotPassword}
            >
              Mot de passe oublié ?
            </Button>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>

      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Réinitialisation de mot de passe</DialogTitle>
            <DialogDescription>
              Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.
            </DialogDescription>
          </DialogHeader>
          <ResetPasswordForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
