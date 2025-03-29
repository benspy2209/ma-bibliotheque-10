
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AuthResult = {
  user: any | null;
  error: Error | null;
};

/**
 * Hook providing authentication methods (sign in, sign out, etc.)
 */
export function useAuthMethods() {
  const { toast } = useToast();
  
  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        description: `Erreur: ${error.message}`
      });
      return { user: null, error };
    }
  }, [toast]);

  const signOut = useCallback(async (): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Force a complete page reload after sign out
      window.location.href = '/';
      return { error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `Erreur lors de la déconnexion: ${error.message}`
      });
      return { error };
    }
  }, [toast]);

  const signInWithGoogle = async (): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`
        }
      });
      
      if (error) throw error;
      // OAuth returns a URL to redirect to, not a user object directly
      // The user will be available after the OAuth flow completes
      return { user: null, error: null };
    } catch (error: any) {
      console.error("Erreur lors de la connexion avec Google:", error);
      toast({
        variant: "destructive",
        description: `Erreur: ${error.message}`
      });
      return { user: null, error };
    }
  };

  const signInWithFacebook = async (): Promise<AuthResult> => {
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
      // OAuth returns a URL to redirect to, not a user object directly
      // The user will be available after the OAuth flow completes
      return { user: null, error: null };
    } catch (error: any) {
      console.error("Error logging in with Facebook:", error);
      toast({
        variant: "destructive",
        description: `Error: ${error.message}`
      });
      return { user: null, error };
    }
  };

  return {
    signIn,
    signOut,
    signInWithGoogle,
    signInWithFacebook
  };
}
