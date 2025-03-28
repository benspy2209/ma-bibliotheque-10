
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ResetPasswordForm } from '../ResetPasswordForm';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

interface LoginTabProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function LoginTab({ isLoading, setIsLoading }: LoginTabProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { toast } = useToast();
  const { setAuthMode } = useSupabaseAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Améliorer le message d'erreur pour être plus précis
        if (error.message === "Invalid login credentials") {
          setLoginError("Identifiants incorrects. Vérifiez votre adresse email et mot de passe ou créez un compte dans l'onglet \"Inscription\".");
        } else {
          setLoginError(`Erreur : ${error.message}`);
        }
        throw error;
      }

      toast({
        description: "Connexion réussie"
      });
      
      // Redirect to search page after successful login
      navigate('/search');
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
      // Ne pas afficher de toast, car nous utilisons maintenant l'alerte dans l'interface
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default button behavior
    setShowResetDialog(true);
  };

  const switchToSignup = () => {
    setAuthMode('signup');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
        {loginError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {loginError}
            </AlertDescription>
          </Alert>
        )}

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
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password-login">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password-login"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              </span>
            </button>
          </div>
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
