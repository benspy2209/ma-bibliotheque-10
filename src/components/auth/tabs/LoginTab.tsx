
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

interface LoginTabProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function LoginTab({ isLoading, setIsLoading }: LoginTabProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const { setAuthMode } = useSupabaseAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast({
        description: "Connexion réussie"
      });
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

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default button behavior
    console.log("Redirection vers réinitialisation du mot de passe");
    // Mettre à jour le mode d'authentification et forcer la mise à jour de l'interface
    setAuthMode('reset');
    // Ajout d'un log pour déboguer
    console.log("Mode d'authentification changé à 'reset'");
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
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
        <div className="text-right">
          <Button 
            type="button" 
            variant="link" 
            className="p-0 h-auto text-xs cursor-pointer" 
            onClick={handleForgotPassword}
          >
            Mot de passe oublié ?
          </Button>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </Button>
    </form>
  );
}
