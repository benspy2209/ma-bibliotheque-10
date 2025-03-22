
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      const newUser = newSession?.user ?? null;
      setSession(newSession);
      setUser(newUser);
      setIsLoading(false);
      
      // Log the auth state change for debugging
      console.log(`Auth state changed: ${event}`, 
        newUser ? `User ID: ${newUser.id}` : 'No user');
      
      // Afficher un toast pour les événements d'authentification significatifs
      if (event === 'SIGNED_IN') {
        toast({
          description: "Connexion réussie"
        });
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
      }
      
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
      setIsLoading(false);
      
      if (currentSession?.user) {
        console.log(`Initial session retrieved, user ID: ${currentSession.user.id}`);
      } else {
        console.log('No initial session found');
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient, toast]);

  const signIn = (mode: 'login' | 'signup' | 'reset' = 'login') => {
    setAuthMode(mode);
    setShowLoginDialog(true);
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `Erreur lors de la déconnexion: ${error.message}`
      });
    }
  };

  return { 
    user, 
    session, 
    signIn, 
    signOut, 
    showLoginDialog, 
    setShowLoginDialog, 
    authMode, 
    setAuthMode,
    isLoading 
  };
}
