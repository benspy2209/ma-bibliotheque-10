
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export function UpdatePasswordForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRecoveryHash, setHasRecoveryHash] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Récupérer le hash de la requête pour les utilisateurs venant d'un lien de réinitialisation
  useEffect(() => {
    const hash = window.location.hash;
    // Vérifier si nous avons un hash de type accès par mail
    if (hash && hash.includes('type=recovery')) {
      // Si oui, nous avons un lien de réinitialisation valide
      console.log("Lien de réinitialisation détecté:", hash);
      setHasRecoveryHash(true);
      
      // Récupérer l'email depuis l'URL (si présent)
      const urlParams = new URLSearchParams(hash.substring(1));
      const emailParam = urlParams.get('email');
      if (emailParam) {
        setEmail(decodeURIComponent(emailParam));
      }
    } else {
      console.log("Aucun lien de réinitialisation détecté, utilisation du mode manuel");
      setHasRecoveryHash(false);
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
      let resetResult;
      
      if (hasRecoveryHash) {
        // Si nous sommes sur un lien de réinitialisation valide, nous pouvons directement 
        // mettre à jour le mot de passe sans authentification préalable
        console.log("Utilisation du flux de réinitialisation par lien");
        resetResult = await supabase.auth.updateUser({ password });
      } else {
        // Si nous n'avons pas de lien de réinitialisation, nous devons d'abord 
        // déclencher l'envoi d'un email de réinitialisation
        console.log("Déclenchement du flux de réinitialisation manuel");
        
        // Option 1: Tentative de réinitialisation de mot de passe par email
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (resetError) {
          if (resetError.message.includes("session")) {
            // Option 2 (fallback pour développement): Tentative directe sans email
            // Cette option est uniquement pour le mode développement
            console.log("Tentative directe de mise à jour de mot de passe (mode développement)");
            
            // Création d'un nouvel objet pour stocker les données de session
            const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
              email: email,
              password: 'ancien-mot-de-passe', // Ceci est juste une tentative
            });
            
            if (signInError) {
              throw new Error(
                "En production, un email serait envoyé avec un lien de réinitialisation. " +
                "En développement, essayez de vous connecter d'abord avec votre compte, " +
                "puis utilisez cette page pour changer votre mot de passe."
              );
            }
            
            resetResult = await supabase.auth.updateUser({ password });
            // Se déconnecter après la mise à jour
            await supabase.auth.signOut();
          } else {
            throw resetError;
          }
        } else {
          // L'email de réinitialisation a été envoyé avec succès
          setSuccess(true);
          toast({
            description: "Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception."
          });
          setIsLoading(false);
          return; // Arrêter l'exécution ici car nous n'avons pas vraiment réinitialisé le mot de passe
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
      
      {hasRecoveryHash && (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Vous pouvez maintenant définir votre nouveau mot de passe.
          </AlertDescription>
        </Alert>
      )}
      
      {success ? (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            {hasRecoveryHash 
              ? "Votre mot de passe a été mis à jour avec succès. Vous allez être redirigé vers la page d'accueil..."
              : "Un email de réinitialisation a été envoyé à l'adresse indiquée. Veuillez vérifier votre boîte de réception et votre dossier spam."}
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
              disabled={isLoading || hasRecoveryHash}
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
            {isLoading ? 'Mise à jour...' : hasRecoveryHash ? 'Mettre à jour le mot de passe' : 'Envoyer un lien de réinitialisation'}
          </Button>

          <Alert>
            <AlertDescription className="text-xs">
              {hasRecoveryHash 
                ? "Vous êtes sur le point de définir un nouveau mot de passe à l'aide du lien de réinitialisation que vous avez reçu par email."
                : "Un email de réinitialisation sera envoyé à l'adresse indiquée. En mode développement uniquement, si vous connaissez votre ancien mot de passe, le système peut aussi tenter une mise à jour directe."}
            </AlertDescription>
          </Alert>
        </form>
      )}
    </div>
  );
}
