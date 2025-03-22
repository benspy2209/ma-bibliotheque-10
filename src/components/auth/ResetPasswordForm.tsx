
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Envoi de l'email de réinitialisation
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
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
            Un email de réinitialisation a été envoyé à {email}. Veuillez vérifier votre boîte de réception et suivre les instructions pour réinitialiser votre mot de passe.
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
            </AlertDescription>
          </Alert>
        </form>
      )}
    </div>
  );
}
