
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Info } from "lucide-react";

interface SignupTabProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function SignupTab({ isLoading, setIsLoading }: SignupTabProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailSentMessage, setEmailSentMessage] = useState('');
  const [skipEmailVerification, setSkipEmailVerification] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailSentMessage('');
    setIsRateLimited(false);
    
    try {
      console.log("Tentative d'inscription avec:", email);
      
      // Utiliser l'option de désactivation de la vérification d'email si elle est cochée
      const signUpOptions = {
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          // Si skipEmailVerification est activé, on essaie de désactiver la vérification
          data: skipEmailVerification ? { skip_confirmation: true } : undefined
        }
      };
      
      const { data, error } = await supabase.auth.signUp(signUpOptions);

      if (error) {
        if (error.message.includes('email rate limit exceeded')) {
          console.error("Erreur d'envoi d'email:", error.message);
          setIsRateLimited(true);
          
          // Tenter une connexion directe puisque le compte a probablement été créé malgré l'erreur
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email, 
            password
          });
          
          if (signInError) {
            console.error("Erreur lors de la connexion après rate limit:", signInError);
            setEmailSentMessage(`L'inscription a été traitée, mais Supabase a limité l'envoi d'emails. Vous pourrez vous connecter ultérieurement. Vous pourrez confirmer votre email plus tard.`);
          } else if (signInData.session) {
            setEmailSentMessage(`Compte créé avec succès! L'email de confirmation sera envoyé ultérieurement (limite d'envoi d'emails atteinte). Vous pouvez utiliser l'application normalement.`);
            toast({
              description: "Connexion réussie! Vous pourrez confirmer votre email plus tard."
            });
          }
          return;
        } else if (error.message.includes('confirmation email') || error.message.includes('sending') || error.message.includes('email')) {
          console.error("Erreur d'envoi d'email:", error.message);
          setEmailSentMessage(`L'inscription a été traitée, mais l'envoi de l'email de confirmation a rencontré un problème: ${error.message}. Veuillez vérifier votre domaine SMTP configuré dans Supabase.`);
          toast({
            description: "Problème d'envoi d'email de confirmation",
            variant: "destructive"
          });
          return;
        }
        throw error;
      }

      console.log("Résultat de l'inscription:", data);
      
      // Vérifier si l'utilisateur est créé mais en attente de confirmation
      if (data?.user?.identities?.length === 0) {
        setEmailSentMessage("Un compte avec cette adresse email existe déjà. Veuillez vous connecter ou réinitialiser votre mot de passe.");
      } else if (data?.user) {
        if (skipEmailVerification && data.session) {
          // L'utilisateur est déjà connecté (vérification d'email contournée)
          toast({
            description: "Inscription réussie ! Vous êtes maintenant connecté."
          });
        } else {
          // Email de confirmation envoyé
          setEmailSentMessage(`Inscription réussie ! Veuillez vérifier votre email (${email}) pour confirmer votre compte. Si vous ne recevez pas d'email dans les prochaines minutes, contactez l'administrateur.`);
          toast({
            description: "Inscription réussie ! Vérifiez votre email pour confirmer votre compte."
          });
        }
      }
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
      toast({
        variant: "destructive",
        description: `Erreur : ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4 w-full max-w-sm">
      {emailSentMessage && (
        <Alert variant={emailSentMessage.includes("existe déjà") || (emailSentMessage.includes("rate limit") && !isRateLimited) ? "destructive" : "default"} className="mb-4">
          {emailSentMessage.includes("existe déjà") || (emailSentMessage.includes("rate limit") && !isRateLimited) ? <AlertCircle className="h-4 w-4" /> : <Info className="h-4 w-4" />}
          <AlertDescription>
            {emailSentMessage}
            {emailSentMessage.includes("Veuillez vérifier votre email") && (
              <strong className="block mt-2">N'oubliez pas de vérifier votre dossier SPAM.</strong>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email-signup">Email</Label>
        <Input
          id="email-signup"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="votre@email.com"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-signup">Mot de passe</Label>
        <Input
          id="password-signup"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Minimum 6 caractères"
          disabled={isLoading}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="skip-verification" 
          checked={skipEmailVerification} 
          onCheckedChange={(checked) => setSkipEmailVerification(checked as boolean)}
        />
        <Label htmlFor="skip-verification" className="text-sm text-gray-500">
          Mode développement (essayer de contourner la vérification d'email)
        </Label>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Création...' : 'Créer un compte'}
      </Button>
      
      <Alert className="mt-4">
        <AlertDescription className="text-xs">
          Note: Les emails de confirmation sont envoyés depuis bienvenue@bibliopulse.be. 
          <span className="block mt-1 font-medium">Vérifiez votre dossier SPAM si vous ne recevez pas l'email.</span>
        </AlertDescription>
      </Alert>
    </form>
  );
}
