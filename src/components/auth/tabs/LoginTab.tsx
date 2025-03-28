
import { useState, useEffect } from 'react';
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
import { AlertCircle, HelpCircle } from "lucide-react";

interface LoginTabProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function LoginTab({ isLoading, setIsLoading }: LoginTabProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [suggestedEmail, setSuggestedEmail] = useState<string | null>(null);
  const { toast } = useToast();
  const { setAuthMode } = useSupabaseAuth();
  const navigate = useNavigate();

  // Réinitialiser l'erreur lors de la modification de l'email
  useEffect(() => {
    setLoginError(null);
    setSuggestedEmail(null);
  }, [email]);

  // Fonction pour chercher un email similaire dans la base de données
  const findSimilarEmail = async (email: string): Promise<string | null> => {
    try {
      // Cette requête nécessite un accès direct à auth.users que nous n'avons pas via l'API Supabase
      // Donc nous allons plutôt implémenter une heuristique simple
      
      // Formats courants d'erreurs
      if (email.includes('@')) {
        // Si l'email contient déjà @, essayons avec sans @ pour voir si un tel utilisateur existe
        const noAtEmail = email.replace('@', '');
        const { error } = await supabase.auth.signInWithPassword({
          email: noAtEmail,
          password: "dummy_for_check_only"
        });
        
        // Si l'erreur est différente de "Invalid login credentials", cela peut signifier que l'email existe
        if (error && error.message !== "Invalid login credentials") {
          return noAtEmail;
        }
      } else {
        // Si l'email ne contient pas @, essayons d'ajouter @ à différents endroits
        // Exemple: si email = "benbeneloo.com", essayons "ben@beneloo.com"
        if (email.includes('.')) {
          const parts = email.split('.');
          if (parts.length > 1) {
            const domainPart = parts.pop();
            const userPart = parts.join('.');
            
            // Diviser la partie utilisateur en deux pour ajouter @ au milieu
            if (userPart.length > 2) {
              const midPoint = Math.floor(userPart.length / 2);
              const suggestedEmail = `${userPart.substring(0, midPoint)}@${userPart.substring(midPoint)}.${domainPart}`;
              
              // Vérifier si cet email existe
              const { error } = await supabase.auth.signInWithPassword({
                email: suggestedEmail,
                password: "dummy_for_check_only"
              });
              
              if (error && error.message !== "Invalid login credentials") {
                return suggestedEmail;
              }
            }
          }
        }
      }
      
      return null;
    } catch (err) {
      console.error("Erreur lors de la recherche d'email similaire:", err);
      return null;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    setSuggestedEmail(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Personnaliser le message d'erreur
        if (error.message === "Invalid login credentials") {
          // Chercher un email similaire
          const similar = await findSimilarEmail(email);
          if (similar) {
            setSuggestedEmail(similar);
            setLoginError(`Identifiants invalides. Avez-vous voulu dire "${similar}" ?`);
          } else {
            setLoginError("Ce compte n'existe pas ou le mot de passe est incorrect. Veuillez réessayer ou créer un compte.");
          }
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
      // Le message d'erreur est géré au-dessus
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

  const useSuggestedEmail = () => {
    if (suggestedEmail) {
      setEmail(suggestedEmail);
    }
  };

  return (
    <>
      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
        {loginError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex flex-col gap-2">
              {loginError}
              {suggestedEmail && (
                <Button 
                  type="button" 
                  variant="outline"
                  size="sm"
                  className="self-start mt-1 text-sm"
                  onClick={useSuggestedEmail}
                >
                  Utiliser "{suggestedEmail}"
                </Button>
              )}
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
