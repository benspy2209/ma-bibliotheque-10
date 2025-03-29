
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
    const result = await signIn(email, password);
    if (result.session) {
      addSystemLog('success', 'Connexion réussie', result.session.user.id, '/auth/login');
    } else if (result.error) {
      addSystemLog('error', `Échec de connexion: ${result.error.message}`, null, '/auth/login');
    }
    return result;
  };

  const enhancedSignOut = async () => {
    const userId = user?.id;
    const result = await signOut();
    if (!result.error && userId) {
      addSystemLog('info', 'Déconnexion réussie', userId, '/auth/logout');
    }
    return result;
  };

  const enhancedSignInWithGoogle = async () => {
    const result = await signInWithGoogle();
    if (result.error) {
      addSystemLog('error', `Échec de connexion Google: ${result.error.message}`, null, '/auth/google-login');
    }
    return result;
  };

  const enhancedSignInWithFacebook = async () => {
    const result = await signInWithFacebook();
    if (result.error) {
      addSystemLog('error', `Échec de connexion Facebook: ${result.error.message}`, null, '/auth/facebook-login');
    }
    return result;
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
