
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';
import { useNavigate } from 'react-router-dom';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset'>('signup');
  const [isLoading, setIsLoading] = useState(true);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      const newUser = newSession?.user ?? null;
      setSession(newSession);
      setUser(newUser);
      setIsLoading(false);
      
      console.log(`Auth state changed: ${event}`, 
        newUser ? `User ID: ${newUser.id}` : 'No user');
      
      // Only show toast notifications for actual auth state changes, not initial loading
      if (initialAuthCheckDone) {
        if (event === 'SIGNED_IN') {
          setShowLoginDialog(false); // Close login dialog automatically
          toast({
            description: "Connexion réussie"
          });
          
          // Force navigation using window.location instead of React Router
          // This ensures a complete page refresh and proper state initialization
          window.location.href = '/library';
        } else if (event === 'SIGNED_OUT') {
          toast({
            description: "Déconnexion réussie"
          });
        } else if (event === 'USER_UPDATED') {
          toast({
            description: "Profil mis à jour"
          });
        } else if (event === 'PASSWORD_RECOVERY') {
          toast({
            description: "Récupération de mot de passe initiée"
          });
          // Redirect to the password reset page
          navigate('/reset-password');
        }
      }
      
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        console.log(`Auth event triggered query invalidation: ${event}`);
        queryClient.invalidateQueries({ type: 'all' });
        queryClient.resetQueries({ queryKey: ['books'] });
        queryClient.resetQueries({ queryKey: ['readingGoals'] });
      }
    });

    // Check for recovery token in URL
    const checkForRecoveryToken = () => {
      // Check different URL patterns where token might be present
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      const pathname = window.location.pathname;
      
      // Check for token in various locations
      const hasRecoveryToken = 
        hash.includes('type=recovery') || 
        hash.includes('access_token') || 
        searchParams.has('token') ||
        searchParams.get('type') === 'recovery' ||
        pathname.includes('/reset-password/');
      
      if (hasRecoveryToken) {
        console.log("Password recovery token detected in URL");
        
        // If not already on reset password page, redirect there
        if (!pathname.startsWith('/reset-password')) {
          console.log("Redirecting to reset password page");
          
          // Extract token from path if present
          if (pathname.match(/\/verify\/[^\/]+/)) {
            const pathToken = pathname.split('/verify/')[1];
            navigate(`/reset-password?token=${pathToken}&type=recovery`);
          } else {
            navigate('/reset-password');
          }
        }
        return true;
      }
      return false;
    };

    // Check current session on load
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
      setInitialAuthCheckDone(true);
      
      if (currentSession?.user) {
        console.log(`Initial session retrieved, user ID: ${currentSession.user.id}`);
      } else {
        console.log('No initial session found');
        
        // Check for recovery tokens
        const hasRecoveryToken = checkForRecoveryToken();
        
        // If no recovery token and on reset password page without parameters, redirect home
        const pathname = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        if (!hasRecoveryToken && pathname === '/reset-password' && !searchParams.has('token')) {
          console.log("No recovery token found, redirecting to home");
          navigate('/');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient, toast, navigate, initialAuthCheckDone]);

  const signIn = useCallback((mode: 'login' | 'signup' | 'reset' = 'signup') => {
    console.log(`signIn called with mode: ${mode}`);
    setAuthMode(mode);
    setShowLoginDialog(true);
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
    user, 
    session, 
    signIn,
    signOut, 
    signInWithGoogle, 
    signInWithFacebook, 
    showLoginDialog, 
    setShowLoginDialog, 
    authMode, 
    setAuthMode,
    isLoading 
  };
}
