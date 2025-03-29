
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook providing authentication methods (sign in, sign out, etc.)
 */
export function useAuthMethods() {
  const { toast } = useToast();
  
  const signIn = useCallback((mode: 'login' | 'signup' | 'reset' = 'signup') => {
    console.log(`signIn called with mode: ${mode}`);
    return mode;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      // Force a complete page reload after sign out
      window.location.href = '/';
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `Erreur lors de la déconnexion: ${error.message}`
      });
    }
  }, [toast]);

  const signInWithGoogle = async () => {
    try {
      console.log("Tentative de connexion avec Google...");
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            prompt: 'select_account'
          }
        }
      });
      
      if (error) {
        console.error("Google OAuth Error:", error);
        throw error;
      }
      
      console.log("Redirection vers Google pour l'authentification...", data);
      
    } catch (error: any) {
      console.error("Erreur lors de la connexion avec Google:", error);
      toast({
        variant: "destructive",
        description: `Erreur: ${error.message}`
      });
    }
  };

  const signInWithFacebook = async () => {
    try {
      console.log("Tentative de connexion avec Facebook...");
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}`,
          scopes: 'email,public_profile'
        }
      });
      
      if (error) {
        console.error("Facebook OAuth Error:", error);
        throw error;
      }
      
      console.log("Redirection vers Facebook pour l'authentification...", data);
      
    } catch (error: any) {
      console.error("Erreur lors de la connexion avec Facebook:", error);
      toast({
        variant: "destructive",
        description: `Erreur: ${error.message}`
      });
    }
  };

  return {
    signIn,
    signOut,
    signInWithGoogle,
    signInWithFacebook
  };
}
