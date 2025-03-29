
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`
        }
      });
      
      if (error) throw error;
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
      
      // Use Supabase OAuth authentication with Facebook provider
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}`,
          // You can specify additional scopes if needed
          scopes: 'email,public_profile'
        }
      });
      
      if (error) {
        console.error("Facebook OAuth Error:", error);
        throw error;
      }
      
      console.log("Redirecting to Facebook for authentication...", data);
      
    } catch (error: any) {
      console.error("Error logging in with Facebook:", error);
      toast({
        variant: "destructive",
        description: `Error: ${error.message}`
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
