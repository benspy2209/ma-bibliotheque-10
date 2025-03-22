
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

        if (error) throw error;

        toast({
          description: "Inscription réussie ! Vérifiez votre email pour confirmer votre compte."
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `Erreur : ${error.message}`
      });
    }
  };

  return (
    <Tabs defaultValue="login" className="w-full" onValueChange={(value) => setAuthMode(value as 'login' | 'signup')}>
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
            />
          </div>
          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>
      </TabsContent>
      
      <TabsContent value="signup">
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
          <div className="space-y-2">
            <Label htmlFor="email-signup">Email</Label>
            <Input
              id="email-signup"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre@email.com"
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
            />
          </div>
          <Button type="submit" className="w-full">
            Créer un compte
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
