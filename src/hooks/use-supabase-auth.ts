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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      const newUser = newSession?.user ?? null;
      setSession(newSession);
      setUser(newUser);
      
      // Log the auth state change for debugging
      console.log(`Auth state changed: ${event}`, 
        newUser ? `User ID: ${newUser.id}` : 'No user');
      
      // Invalidate and refetch all queries when auth state changes
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        console.log(`Auth event triggered query invalidation: ${event}`);
        queryClient.invalidateQueries({ type: 'all' });
        queryClient.resetQueries({ queryKey: ['books'] });
        queryClient.resetQueries({ queryKey: ['readingGoals'] });
      }
    });

    // THEN check for existing session
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

  // Fonction de déconnexion complète qui nettoie également le stockage local
  const completeSignOut = async () => {
    try {
      // Déconnexion standard via Supabase
      await supabase.auth.signOut();
      
      // Nettoyer le stockage local
      localStorage.clear();
      
      // Redirection pour s'assurer que toute l'application est rechargée
      window.location.href = '/';
      
      console.log('Déconnexion complète effectuée');
    } catch (error) {
      console.error('Erreur lors de la déconnexion complète:', error);
    }
  };

  // Fonction améliorée pour déconnecter GitHub et permettre la reconnexion
  const emergencyGitHubDisconnect = () => {
    try {
      // Rechercher et supprimer uniquement les cookies liés à GitHub
      document.cookie.split(";").forEach((c) => {
        const cookieName = c.trim().split("=")[0];
        if (cookieName.includes("github") || cookieName.includes("gh_") || cookieName.includes("_gh")) {
          document.cookie = `${cookieName}=;expires=${new Date().toUTCString()};path=/`;
        }
      });
      
      // Supprimer les données GitHub du stockage local
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes("github") || key.includes("gh_") || key.includes("_gh"))) {
          localStorage.removeItem(key);
        }
      }
      
      // Supprimer le token de Supabase pour forcer une nouvelle connexion
      const supabaseKey = Object.keys(localStorage).find(key => 
        key.startsWith('sb-') && key.includes('-auth-token')
      );
      
      if (supabaseKey) {
        localStorage.removeItem(supabaseKey);
      }
      
      // Afficher un message de succès
      console.log('Déconnexion GitHub réussie - vous pouvez maintenant vous reconnecter');
      
      // Rediriger vers la page d'accueil
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion GitHub:', error);
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
