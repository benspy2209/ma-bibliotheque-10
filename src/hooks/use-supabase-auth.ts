import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      const newUser = newSession?.user ?? null;
      setSession(newSession);
      setUser(newUser);
      
      console.log(`Auth state changed: ${event}`, 
        newUser ? `User ID: ${newUser.id}` : 'No user');
      
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        console.log(`Auth event triggered query invalidation: ${event}`);
        queryClient.invalidateQueries({ type: 'all' });
        queryClient.resetQueries({ queryKey: ['books'] });
        queryClient.resetQueries({ queryKey: ['readingGoals'] });
      }
    });

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log(`Initial session retrieved, user ID: ${currentSession.user.id}`);
      } else {
        console.log('No initial session found');
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const signIn = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setShowLoginDialog(true);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const completeSignOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      window.location.href = '/';
      console.log('Déconnexion complète effectuée');
    } catch (error) {
      console.error('Erreur lors de la déconnexion complète:', error);
    }
  };

  const emergencyGitHubDisconnect = () => {
    try {
      const cookiesToDelete = ['github', 'gh_', '_gh', 'supabase', 'sb-'];
      document.cookie.split(";").forEach((c) => {
        const cookieName = c.trim().split("=")[0];
        for (const prefix of cookiesToDelete) {
          if (cookieName.toLowerCase().includes(prefix.toLowerCase())) {
            document.cookie = `${cookieName}=;expires=${new Date().toUTCString()};path=/;domain=${window.location.hostname}`;
            document.cookie = `${cookieName}=;expires=${new Date().toUTCString()};path=/`;
          }
        }
      });
      
      const keysToDelete = ['github', 'gh_', '_gh', 'supabase', 'sb-'];
      for (const prefix of keysToDelete) {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && key.toLowerCase().includes(prefix.toLowerCase())) {
            localStorage.removeItem(key);
          }
        }
      }
      
      localStorage.removeItem('supabase.auth.token');
      
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sb-') && key.includes('-auth-token')) {
          localStorage.removeItem(key);
        }
      }
      
      setUser(null);
      setSession(null);
      
      console.log('Déconnexion GitHub complète effectuée');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (error) {
      console.error('Erreur lors de la déconnexion GitHub:', error);
      alert('Erreur lors de la déconnexion. Veuillez rafraîchir manuellement la page.');
    }
  };

  return { 
    user, 
    session, 
    signIn, 
    signOut, 
    completeSignOut,
    emergencyGitHubDisconnect,
    showLoginDialog, 
    setShowLoginDialog, 
    authMode 
  };
}
