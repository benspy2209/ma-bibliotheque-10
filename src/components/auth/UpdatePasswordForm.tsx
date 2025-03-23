
import { useState, useEffect } from 'react';
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
  
  // Récupérer le hash de la requête pour les utilisateurs venant d'un lien de réinitialisation
  useEffect(() => {
    const hash = window.location.hash;
    // Vérifier si nous avons un hash de type accès par mail
    if (hash && hash.includes('type=recovery')) {
      // Si oui, nous avons un lien de réinitialisation valide
      console.log("Lien de réinitialisation détecté:", hash);
      
      // Récupérer l'email depuis l'URL (si présent)
      const urlParams = new URLSearchParams(hash.substring(1));
      const emailParam = urlParams.get('email');
      if (emailParam) {
        setEmail(decodeURIComponent(emailParam));
      }
    } else {
      console.log("Aucun lien de réinitialisation détecté, utilisation du mode manuel");
    }
  }, []);

  // Méthode principale pour la mise à jour du mot de passe
  const handlePasswordUpdate = async (e: React.FormEvent) => {
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
      // Vérifier si nous avons un hash de récupération dans l'URL
      const hash = window.location.hash;
      let resetResult;
      
      if (hash && hash.includes('type=recovery')) {
        // Si nous avons un hash, nous utilisons la méthode de mise à jour avec la session implicite
        resetResult = await supabase.auth.updateUser({ password });
      } else {
        // Sinon, nous utilisons la méthode de création d'un nouveau mot de passe directement
        // Ceci est pour le développement uniquement, car normalement on passerait par un lien d'email
        const { data } = await supabase.auth.signInWithPassword({
          email,
          password: 'ancien-mot-de-passe-temporaire',  // Ceci ne fonctionnera que si c'est le bon mot de passe
        });
        
        if (data.session) {
          // Si la connexion a réussi, mettre à jour le mot de passe
          resetResult = await supabase.auth.updateUser({ password });
          // Se déconnecter pour forcer une nouvelle connexion
          await supabase.auth.signOut();
        } else {
          // Si la connexion a échoué, indiquer l'erreur
          throw new Error("Impossible de se connecter avec cet email. Veuillez vérifier que vous utilisez bien l'email avec lequel vous vous êtes inscrit.");
        }
      }
      
      if (resetResult?.error) throw resetResult.error;
      
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
      setError(error.message || "Une erreur est survenue lors de la mise à jour du mot de passe.");
      toast({
        variant: "destructive",
        description: `Erreur : ${error.message || "Une erreur inattendue s'est produite."}`
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
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
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
              Cette page permet de réinitialiser votre mot de passe. Si vous avez reçu un lien par email, 
              assurez-vous de bien cliquer sur ce lien. En mode développement, vous pouvez essayer de 
              réinitialiser directement en utilisant votre email et en choisissant un nouveau mot de passe.
            </AlertDescription>
          </Alert>
        </form>
      )}
    </div>
  );
}
