
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = () => {
    setShowLoginDialog(true);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, signIn, signOut, showLoginDialog, setShowLoginDialog };
}
