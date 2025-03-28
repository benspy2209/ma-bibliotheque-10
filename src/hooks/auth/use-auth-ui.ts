
import { useState } from 'react';

/**
 * Hook for managing auth UI state (dialogs, modes, etc.)
 */
export function useAuthUI() {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset'>('signup');

  return {
    showLoginDialog,
    setShowLoginDialog,
    authMode,
    setAuthMode
  };
}
