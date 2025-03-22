
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
        const { error } = await supabase.auth.signUp({
          email,
          password
        });

        if (error) {
          // Si l'erreur contient "confirmation email", on traite spécialement
          if (error.message.includes('confirmation email') || error.message.includes('sending')) {
            console.error("Erreur d'envoi d'email:", error.message);
            setEmailSentMessage("L'inscription a réussi, mais l'envoi de l'email de confirmation a échoué. Cela peut être dû à un problème de configuration DNS.");
            toast({
              description: "Compte créé, mais problème d'envoi d'email de confirmation",
              variant: "default"
            });
            return;
          }
          throw error;
        }

        setEmailSentMessage("Inscription réussie ! Si vous ne recevez pas d'email de confirmation, veuillez contacter l'administrateur.");
        toast({
          description: "Inscription réussie ! Vérifiez votre email pour confirmer votre compte."
        });
      }
    } catch (error: any) {
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
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
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
              Note: Si vous ne recevez pas d'email de confirmation, veuillez vérifier votre dossier spam ou contacter l'administrateur.
            </AlertDescription>
          </Alert>
        </form>
      </TabsContent>
    </Tabs>
  );
}
