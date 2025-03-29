
import { useAuthState } from './auth/use-auth-state';
import { useAuthMethods } from './auth/use-auth-methods';
import { useAuthUI } from './auth/use-auth-ui';
import { useRecoveryToken } from './auth/use-recovery-token';
import { useEffect } from 'react';
import { addSystemLog } from '@/services/supabaseAdminStats';

/**
 * Main hook for Supabase authentication
 * Combines multiple specialized hooks for complete auth functionality
 */
export function useSupabaseAuth() {
  // Combine all the specialized hooks
  const { user, session, isLoading, initialAuthCheckDone } = useAuthState();
  const { signIn, signOut, signInWithGoogle, signInWithFacebook } = useAuthMethods();
  const { showLoginDialog, setShowLoginDialog, authMode, setAuthMode } = useAuthUI();
  const { checkForRecoveryToken } = useRecoveryToken();

  // Check for recovery token when the component mounts
  useEffect(() => {
    if (initialAuthCheckDone && !user) {
      const hasRecoveryToken = checkForRecoveryToken();
      
      // If no recovery token and on reset password page without parameters, redirect home
      const pathname = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      if (!hasRecoveryToken && pathname === '/reset-password' && !searchParams.has('token')) {
        console.log("No recovery token found, redirecting to home");
        window.location.href = '/';
      }
    }
  }, [initialAuthCheckDone, user]);

  // Enhanced auth methods with logging
  const enhancedSignIn = async (email: string, password: string) => {
    try {
      const result = await signIn(email, password);
      if (result.user) {
        addSystemLog('success', 'Connexion réussie', result.user.id, '/auth/login');
      } else if (result.error) {
        addSystemLog('error', `Échec de connexion: ${result.error.message}`, null, '/auth/login');
      }
      return result;
    } catch (error) {
      console.error("Sign in error:", error);
      return { user: null, error: error as Error };
    }
  };

  const enhancedSignOut = async () => {
    try {
      const userId = user?.id;
      await signOut();
      if (userId) {
        addSystemLog('info', 'Déconnexion réussie', userId, '/auth/logout');
      }
      return { error: null };
    } catch (error) {
      console.error("Sign out error:", error);
      return { error: error as Error };
    }
  };

  const enhancedSignInWithGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.error) {
        addSystemLog('error', `Échec de connexion Google: ${result.error.message}`, null, '/auth/google-login');
      }
      return result;
    } catch (error) {
      console.error("Google sign in error:", error);
      return { error: error as Error };
    }
  };

  const enhancedSignInWithFacebook = async () => {
    try {
      const result = await signInWithFacebook();
      if (result.error) {
        addSystemLog('error', `Échec de connexion Facebook: ${result.error.message}`, null, '/auth/facebook-login');
      }
      return result;
    } catch (error) {
      console.error("Facebook sign in error:", error);
      return { error: error as Error };
    }
  };

  // Expose a unified API that matches the original hook but with enhanced methods
  return {
    user,
    session,
    signIn: enhancedSignIn,
    signOut: enhancedSignOut,
    signInWithGoogle: enhancedSignInWithGoogle,
    signInWithFacebook: enhancedSignInWithFacebook,
    showLoginDialog,
    setShowLoginDialog,
    authMode,
    setAuthMode,
    isLoading
  };
}
