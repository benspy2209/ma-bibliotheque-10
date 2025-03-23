
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export function UpdatePasswordForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // En mode développement, permettre de réinitialiser le mot de passe directement
  const handleResetPasswordDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email) {
      setError("Veuillez saisir votre adresse email.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Tentative de connexion avec l'email fourni
      // Note: Cette méthode ne fonctionnera que pour les comptes existants
      const { error: resetError } = await supabase.auth.updateUser({
        email: email,
        password: password
      });

      if (resetError) throw resetError;
      
      setSuccess(true);
      toast({
        description: "Votre mot de passe a été mis à jour avec succès."
      });
      
      // Rediriger vers la page d'accueil après 3 secondes
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      setError(error.message);
      toast({
        variant: "destructive",
        description: `Erreur : ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Réinitialisation du mot de passe</h2>
      
      {success ? (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            Votre mot de passe a été mis à jour avec succès. Vous allez être redirigé vers la page d'accueil...
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleResetPasswordDirect} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Votre email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre@email.com"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
          </Button>

          <Alert>
            <AlertDescription className="text-xs">
              Vous devez utiliser l'email avec lequel vous vous êtes inscrit pour que cette réinitialisation fonctionne.
            </AlertDescription>
          </Alert>
        </form>
      )}
    </div>
  );
}
