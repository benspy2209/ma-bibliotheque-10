
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
  
  // Parse hash parameters from URL for recovery links
  const parseHashParameters = (hash: string) => {
    if (!hash || hash === '') return {};
    
    const hashParams: Record<string, string> = {};
    const hashParts = hash.substring(1).split('&');
    
    hashParts.forEach(part => {
      const [key, value] = part.split('=');
      if (key && value) {
        hashParams[key] = decodeURIComponent(value);
      }
    });
    
    return hashParams;
  };
  
  // Check for recovery token in the URL hash
  useEffect(() => {
    const hash = window.location.hash;
    console.log("URL hash:", hash);
    
    // Check if we have a recovery type or token in the URL
    const hashParams = parseHashParameters(hash);
    const isRecovery = 
      hash.includes('type=recovery') || 
      hashParams.type === 'recovery' ||
      hashParams.access_token;
    
    if (isRecovery) {
      console.log("Recovery link detected:", hashParams);
      setHasRecoveryHash(true);
      
      // Try to extract email from token or URL parameters
      if (hashParams.email) {
        setEmail(hashParams.email);
      }
      
      // Handle direct access tokens for Supabase password recovery
      if (hashParams.access_token) {
        // When we have an access_token in the URL, Supabase has already authenticated the user
        // with a temporary session. We just need to notify users they can reset their password.
        toast({
          description: "Vous pouvez maintenant réinitialiser votre mot de passe"
        });
      }
    } else {
      console.log("No recovery link detected, using manual mode");
      setHasRecoveryHash(false);
    }
  }, [toast]);

  // Main method for password update
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
      // Check if we have a recovery hash in the URL
      let resetResult;
      
      if (hasRecoveryHash) {
        // If we're on a valid reset link, we can directly 
        // update the password without prior authentication
        console.log("Using password reset link flow");
        resetResult = await supabase.auth.updateUser({ password });
        
        // Check if the update was successful
        if (resetResult.error) {
          throw resetResult.error;
        }
        
        console.log("Password updated successfully");
        setSuccess(true);
        toast({
          description: "Votre mot de passe a été mis à jour avec succès."
        });
        
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        // If we don't have a reset link, we need to 
        // trigger a password reset email
        console.log("Triggering manual reset flow");
        
        // Send password reset email
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (resetError) {
          // Check for specific error messages to provide better guidance
          if (resetError.message.includes("Invalid email")) {
            throw new Error("L'adresse email n'existe pas dans notre base de données.");
          } else if (resetError.message.includes("For security purposes")) {
            throw new Error("Pour des raisons de sécurité, veuillez attendre quelques secondes avant de réessayer.");
          } else {
            throw resetError;
          }
        }
        
        // Reset email sent successfully
        setSuccess(true);
        toast({
          description: "Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception et votre dossier SPAM."
        });
      }
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
                : "Un email de réinitialisation sera envoyé à l'adresse indiquée. Vérifiez bien votre dossier SPAM si vous ne trouvez pas l'email."}
            </AlertDescription>
          </Alert>
        </form>
      )}
    </div>
  );
}
