
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
  const [resetEmailError, setResetEmailError] = useState<string | null>(null);
  const [hasRecoveryToken, setHasRecoveryToken] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Parse hash parameters from URL
  const parseHashParameters = useCallback((hash: string) => {
    if (!hash || hash === '') return {};
    
    const hashParams: Record<string, string> = {};
    const hashParts = hash.substring(1).split('&');
    
    hashParts.forEach(part => {
      const [key, value] = part.split('=');
      if (key && value) {
        hashParams[key] = decodeURIComponent(value);
      }
    });
    
    return hashParams;
  }, []);

  // Check for recovery token in URL hash
  const checkForRecoveryToken = useCallback(() => {
    const hash = window.location.hash;
    const hashParams = parseHashParameters(hash);
    
    // Check if we have recovery type or access_token in hash
    const hasValidRecoveryToken = 
      (hash.includes('type=recovery') && !hash.includes('error=')) || 
      !!hashParams.access_token;
    
    // Check for error in token
    const hasTokenError = hash.includes('error=') && hash.includes('error_code=');
    
    console.log("Recovery token check:", { 
      hasValidRecoveryToken, 
      hasTokenError, 
      hash 
    });
    
    setHasRecoveryToken(hasValidRecoveryToken);
    
    if (hasTokenError) {
      // Extract error details
      const errorCode = hashParams.error_code;
      const errorDescription = hashParams.error_description;
      
      console.log("Recovery token error:", { errorCode, errorDescription });
      
      if (errorCode === 'otp_expired' || hash.includes('expired')) {
        setResetEmailError('Le lien de réinitialisation a expiré. Veuillez demander un nouveau lien.');
      } else {
        setResetEmailError(`Erreur: ${errorDescription || 'Lien de réinitialisation invalide'}`);
      }
      
      setAuthMode('reset');
      setShowLoginDialog(true);
      navigate('/reset-password');
      return false;
    }
    
    if (hasValidRecoveryToken) {
      setAuthMode('reset');
      setShowLoginDialog(true);
      navigate('/reset-password');
      return true;
    }
    
    return false;
  }, [parseHashParameters, navigate]);

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
          
          // Close the dialog and redirect after successful password update
          setTimeout(() => {
            setShowLoginDialog(false);
            window.location.href = '/';
          }, 1500);
        } else if (event === 'PASSWORD_RECOVERY') {
          toast({
            description: "Récupération de mot de passe initiée"
          });
          // Redirect to reset-password page
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

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
      setInitialAuthCheckDone(true);
      
      if (currentSession?.user) {
        console.log(`Initial session retrieved, user ID: ${currentSession.user.id}`);
      } else {
        console.log('No initial session found');
        
        // Only check for recovery token if no active session
        checkForRecoveryToken();
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient, toast, navigate, initialAuthCheckDone, checkForRecoveryToken]);

  // Re-check for recovery token when URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      console.log("URL hash changed, checking for recovery token");
      checkForRecoveryToken();
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [checkForRecoveryToken]);

  const signIn = useCallback((mode: 'login' | 'signup' | 'reset' = 'signup') => {
    console.log(`signIn called with mode: ${mode}`);
    setAuthMode(mode);
    setShowLoginDialog(true);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      // Force a full page reload after sign out to ensure a clean state
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
      
      // Utiliser l'authentification OAuth de Supabase avec le provider Facebook
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}`,
          // Vous pouvez spécifier des scopes supplémentaires si nécessaire
          scopes: 'email,public_profile'
        }
      });
      
      if (error) {
        console.error("Erreur OAuth Facebook:", error);
        throw error;
      }
      
      console.log("Redirection vers Facebook pour authentification...", data);
      
    } catch (error: any) {
      console.error("Erreur lors de la connexion avec Facebook:", error);
      toast({
        variant: "destructive",
        description: `Erreur: ${error.message}`
      });
    }
  };

  // Clear error when changing auth mode
  useEffect(() => {
    setResetEmailError(null);
  }, [authMode]);

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
    isLoading,
    resetEmailError,
    hasRecoveryToken,
    checkForRecoveryToken
  };
}
