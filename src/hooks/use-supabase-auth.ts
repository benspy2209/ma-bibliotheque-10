
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

  return { user, session, signIn, signOut, showLoginDialog, setShowLoginDialog, authMode };
}
