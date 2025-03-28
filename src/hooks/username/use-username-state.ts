
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export function useUsernameState(user: User | null) {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [nextChangeDate, setNextChangeDate] = useState<Date | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch the current username
  const fetchUsername = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching username:', error);
        return;
      }
      
      setUsername(data.username);
      
      // Check if user is admin
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user?.email === 'debruijneb@gmail.com') {
        setIsAdmin(true);
        setCanChangeUsername(true); // Admin can always change username
      }
    } catch (error) {
      console.error('Error in fetchUsername:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username,
    setUsername,
    isLoading,
    setIsLoading,
    canChangeUsername,
    setCanChangeUsername,
    nextChangeDate,
    setNextChangeDate,
    isAdmin,
    setIsAdmin,
    fetchUsername
  };
}
