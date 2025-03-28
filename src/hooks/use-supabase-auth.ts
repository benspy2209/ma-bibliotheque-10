
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
          // Redirection vers la page de réinitialisation du mot de passe
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

    // Vérifier s'il y a un hash token de récupération dans l'URL 
    const checkForRecoveryToken = () => {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      
      if (hash.includes('type=recovery') || hash.includes('access_token') || searchParams.has('token')) {
        console.log("Token de récupération détecté dans l'URL");
        
        // Si on est sur la page de reset password, on n'a rien à faire,
        // sinon on redirige vers cette page
        if (!window.location.pathname.includes('/reset-password')) {
          navigate('/reset-password');
        }
      }
    };

    // Vérifier la session au chargement
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
      setInitialAuthCheckDone(true);
      
      if (currentSession?.user) {
        console.log(`Session initiale récupérée, ID utilisateur: ${currentSession.user.id}`);
      } else {
        console.log('Aucune session initiale trouvée');
        
        // Vérifier les tokens de récupération
        checkForRecoveryToken();
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient, toast, navigate, initialAuthCheckDone]);

  const signIn = useCallback((mode: 'login' | 'signup' | 'reset' = 'signup') => {
    console.log(`signIn appelé avec le mode: ${mode}`);
    setAuthMode(mode);
    setShowLoginDialog(true);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      // Force un rechargement complet de la page après la déconnexion
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
