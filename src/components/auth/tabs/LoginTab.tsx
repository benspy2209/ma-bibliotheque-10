
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ResetPasswordForm } from '../ResetPasswordForm';
import { useLogin } from "@/hooks/use-login";
import { EmailInput } from '../login/EmailInput';
import { PasswordInput } from '../login/PasswordInput';
import { LoginError } from '../login/LoginError';

interface LoginTabProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function LoginTab({ isLoading, setIsLoading }: LoginTabProps) {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const { setAuthMode } = useSupabaseAuth();
  const { 
    email, 
    password, 
    loginError, 
    suggestedEmail, 
    setEmail, 
    setPassword, 
    handleLogin, 
    useSuggestedEmail 
  } = useLogin();

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default button behavior
    setShowResetDialog(true);
  };

  const switchToSignup = () => {
    setAuthMode('signup');
  };

  return (
    <>
      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
        <LoginError 
          errorMessage={loginError} 
          suggestedEmail={suggestedEmail} 
          onUseSuggestion={useSuggestedEmail} 
        />

        <EmailInput 
          email={email} 
          onChange={setEmail} 
          isLoading={isLoading} 
        />

        <PasswordInput 
          password={password} 
          onChange={setPassword} 
          isLoading={isLoading} 
          onForgotPassword={handleForgotPassword} 
        />

        <Button type="submit" className="w-full" variant="pulse" disabled={isLoading}>
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </Button>

        <div className="text-center text-sm mt-4">
          <span>Pas encore de compte? </span>
          <Button 
            type="button" 
            variant="link" 
            className="p-0 h-auto text-sm" 
            onClick={switchToSignup}
          >
            Créer un compte
          </Button>
        </div>
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
