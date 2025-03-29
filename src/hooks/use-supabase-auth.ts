
import { useAuthState } from './auth/use-auth-state';
import { useAuthMethods } from './auth/use-auth-methods';
import { useAuthUI } from './auth/use-auth-ui';
import { useRecoveryToken } from './auth/use-recovery-token';
import { useEffect } from 'react';

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

  // Expose a unified API that matches the original hook
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
