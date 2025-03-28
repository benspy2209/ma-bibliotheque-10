
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Info } from "lucide-react";

export function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  // Déterminer l'URL de production en fonction de l'environnement
  const getRedirectUrl = () => {
    // En production, utiliser bibliopulse.com
    if (window.location.hostname === 'bibliopulse.com' || 
        window.location.hostname === 'www.bibliopulse.com') {
      return `https://${window.location.hostname}/reset-password`;
    }
    // Sinon, utiliser l'URL actuelle
    return `${window.location.origin}/reset-password`;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Utiliser l'URL de redirection appropriée
      const redirectUrl = getRedirectUrl();
      console.log(`Redirection vers: ${redirectUrl}`);
      
      // Envoi de l'email de réinitialisation
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;
      
      setEmailSent(true);
      toast({
        description: "Email de réinitialisation envoyé"
      });
    } catch (error: any) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      toast({
        variant: "destructive",
        description: `Erreur : ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      {emailSent ? (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Un email de réinitialisation a été envoyé à {email}. 
            <strong className="block mt-2">Veuillez vérifier votre boîte de réception ainsi que votre dossier SPAM</strong>, 
            puis suivre les instructions pour réinitialiser votre mot de passe.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-reset">Email</Label>
            <Input
              id="email-reset"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre@email.com"
              disabled={isLoading}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Envoi en cours...' : 'Réinitialiser le mot de passe'}
          </Button>
          
          <Alert>
            <AlertDescription className="text-xs">
              Un email sera envoyé avec les instructions pour réinitialiser votre mot de passe.
              <span className="block mt-1 font-medium">N'oubliez pas de vérifier votre dossier SPAM si vous ne trouvez pas l'email.</span>
            </AlertDescription>
          </Alert>
        </form>
      )}
    </div>
  );
}
