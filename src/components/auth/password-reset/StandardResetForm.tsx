
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface StandardResetFormProps {
  email: string;
  setEmail: (email: string) => void;
}

export function StandardResetForm({ email, setEmail }: StandardResetFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email) {
      setError("Veuillez saisir votre adresse email.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Envoi d'un email de réinitialisation à:", email);
      
      // Envoyer un email de réinitialisation
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (resetError) {
        if (resetError.message.includes("Invalid email")) {
          throw new Error("L'adresse email n'existe pas dans notre base de données.");
        } else if (resetError.message.includes("For security purposes")) {
          throw new Error("Pour des raisons de sécurité, veuillez attendre quelques secondes avant de réessayer.");
        } else {
          throw resetError;
        }
      }
      
      setSuccess(true);
      toast({
        description: "Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception et votre dossier SPAM."
      });
      
    } catch (error: any) {
      console.error("Erreur lors de l'envoi de l'email de réinitialisation:", error);
      setError(error.message || "Une erreur est survenue lors de l'envoi de l'email de réinitialisation.");
      toast({
        variant: "destructive",
        description: `Erreur : ${error.message || "Une erreur inattendue s'est produite."}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Alert className="mb-4 bg-green-50 border-green-200">
        <Info className="h-4 w-4 text-green-600" />
        <AlertDescription>
          Un email de réinitialisation a été envoyé à l'adresse indiquée. Veuillez vérifier votre boîte de réception et votre dossier spam.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSendResetEmail} className="space-y-4">
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
          placeholder="email@exemple.com"
          disabled={isLoading}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Envoi en cours...' : 'Envoyer un lien de réinitialisation'}
      </Button>

      <Alert>
        <AlertDescription className="text-xs">
          Un email de réinitialisation sera envoyé à l'adresse indiquée. Vérifiez bien votre dossier SPAM si vous ne trouvez pas l'email.
        </AlertDescription>
      </Alert>
    </form>
  );
}
