
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Eye, EyeOff, Info } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

interface SignupTabProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function SignupTab({ isLoading, setIsLoading }: SignupTabProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailSentMessage, setEmailSentMessage] = useState('');
  const [isRateLimited, setIsRateLimited] = useState(false);
  const { toast } = useToast();
  const { setAuthMode } = useSupabaseAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailSentMessage('');
    setIsRateLimited(false);
    
    try {
      console.log("Tentative d'inscription avec:", email);
      
      const signUpOptions = {
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
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
        if (data.session) {
          // L'utilisateur est déjà connecté
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

  const switchToLogin = () => {
    setAuthMode('login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4 w-full max-w-sm">
      {emailSentMessage && (
        <Alert 
          variant={emailSentMessage.includes("existe déjà") || (emailSentMessage.includes("rate limit") && !isRateLimited) ? "destructive" : "default"}
        >
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
        <div className="relative">
          <Input
            id="password-signup"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Minimum 6 caractères"
            disabled={isLoading}
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
      </div>
      
      <Button type="submit" className="w-full" variant="pulse" disabled={isLoading}>
        {isLoading ? 'Création...' : 'Créer un compte'}
      </Button>
      
      <div className="text-center text-sm mt-4">
        <span>Déjà un compte? </span>
        <Button 
          type="button" 
          variant="link" 
          className="p-0 h-auto text-sm" 
          onClick={switchToLogin}
        >
          Se connecter
        </Button>
      </div>
      
      <Alert className="mt-4">
        <AlertDescription className="text-xs">
          Note: Les emails de confirmation sont envoyés depuis bienvenue@bibliopulse.be. 
          <span className="block mt-1 font-medium">Vérifiez votre dossier SPAM si vous ne recevez pas l'email.</span>
        </AlertDescription>
      </Alert>
    </form>
  );
}
