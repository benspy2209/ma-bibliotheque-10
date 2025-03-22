
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

interface LoginFormProps {
  defaultTab?: 'login' | 'signup';
}

export function LoginForm({ defaultTab = 'login' }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSentMessage, setEmailSentMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailSentMessage('');
    
    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        toast({
          description: "Connexion réussie"
        });
      } else {
        // Inscription
        console.log("Tentative d'inscription avec:", email);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });

        if (error) {
          if (error.message.includes('email rate limit exceeded')) {
            console.error("Erreur d'envoi d'email:", error.message);
            setEmailSentMessage(`L'inscription a été traitée, mais Supabase a limité l'envoi d'emails (rate limit). Veuillez attendre quelques minutes avant de réessayer ou contactez l'administrateur.`);
            toast({
              description: "Problème d'envoi d'email de confirmation",
              variant: "destructive"
            });
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
    <Tabs defaultValue={defaultTab} className="w-full" onValueChange={(value) => setAuthMode(value as 'login' | 'signup')}>
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Connexion</TabsTrigger>
        <TabsTrigger value="signup">Inscription</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login">
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
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
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </TabsContent>
      
      <TabsContent value="signup">
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
          {emailSentMessage && (
            <Alert variant={emailSentMessage.includes("existe déjà") || emailSentMessage.includes("rate limit") ? "destructive" : "default"} className="mb-4">
              {emailSentMessage.includes("existe déjà") || emailSentMessage.includes("rate limit") ? <AlertCircle className="h-4 w-4" /> : <Info className="h-4 w-4" />}
              <AlertDescription>
                {emailSentMessage}
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Création...' : 'Créer un compte'}
          </Button>
          
          <Alert className="mt-4">
            <AlertDescription className="text-xs">
              Note: Les emails de confirmation sont envoyés depuis bienvenue@bookpulse.be. Vérifiez votre dossier spam si vous ne recevez pas l'email.
            </AlertDescription>
          </Alert>
        </form>
      </TabsContent>
    </Tabs>
  );
}
