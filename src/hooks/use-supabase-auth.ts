
import { useState, useEffect } from 'react';
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

  // Fonction pour s'assurer qu'un profil existe pour l'utilisateur
  const ensureUserProfile = async (userId: string) => {
    try {
      // Vérifier si un profil existe
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Erreur lors de la vérification du profil:', profileError);
        return;
      }
      
      // Si aucun profil n'existe, en créer un
      if (!profile) {
        console.log('Aucun profil trouvé pour l\'utilisateur, création d\'un nouveau profil:', userId);
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ id: userId });
          
        if (insertError) {
          console.error('Erreur lors de la création du profil:', insertError);
        } else {
          console.log('Profil créé avec succès pour:', userId);
        }
      } else {
        console.log('Profil existant trouvé pour:', userId);
      }
    } catch (err) {
      console.error('Erreur dans ensureUserProfile:', err);
    }
  };

  useEffect(() => {
    // Définir la fonction de gestion des changements d'état d'authentification
    const handleAuthStateChange = (event: string, currentSession: Session | null) => {
      const currentUser = currentSession?.user ?? null;
      
      console.log(`Auth state changed: ${event}`, 
        currentUser ? `User ID: ${currentUser.id}` : 'No user');
      
      setSession(currentSession);
      setUser(currentUser);
      setIsLoading(false);
      
      // Only show toast notifications for actual auth state changes, not initial loading
      if (initialAuthCheckDone) {
        if (event === 'SIGNED_IN') {
          // Créer un profil utilisateur si nécessaire
          if (currentUser) {
            // Utiliser setTimeout pour éviter les problèmes de mutex avec Supabase
            setTimeout(() => {
              ensureUserProfile(currentUser.id);
            }, 0);
          }
          
          setShowLoginDialog(false); // Ferme automatiquement le dialogue de connexion
          toast({
            description: "Connexion réussie"
          });
          navigate('/library');
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
      }
      
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        console.log(`Auth event triggered query invalidation: ${event}`);
        queryClient.invalidateQueries({ type: 'all' });
        queryClient.resetQueries({ queryKey: ['books'] });
        queryClient.resetQueries({ queryKey: ['readingGoals'] });
      }
    };

    // S'abonner aux changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Vérifier la session existante au chargement
    const checkExistingSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        // Appeler manuellement handleAuthStateChange pour gérer la session initiale
        handleAuthStateChange(
          currentSession ? 'INITIAL_SESSION' : 'NO_SESSION', 
          currentSession
        );
        
        // Si l'utilisateur est connecté, vérifier/créer son profil
        if (currentSession?.user) {
          console.log(`Initial session retrieved, user ID: ${currentSession.user.id}`);
          await ensureUserProfile(currentSession.user.id);
        } else {
          console.log('No initial session found');
        }
        
        setInitialAuthCheckDone(true);
      } catch (error) {
        console.error('Error checking existing session:', error);
        setIsLoading(false);
        setInitialAuthCheckDone(true);
      }
    };
    
    checkExistingSession();

    return () => subscription.unsubscribe();
  }, [queryClient, toast, navigate, initialAuthCheckDone]);

  const signIn = (mode: 'login' | 'signup' | 'reset' = 'signup') => {
    console.log(`signIn called with mode: ${mode}`);
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
    isLoading,
    ensureUserProfile  // Exposer cette fonction pour l'utiliser ailleurs si nécessaire
  };
}
