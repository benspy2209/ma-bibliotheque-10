
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export function useUsernamePermissions(
  user: User | null,
  setIsLoading: (loading: boolean) => void,
  setCanChangeUsername: (canChange: boolean) => void,
  setNextChangeDate: (date: Date | null) => void,
  setIsAdmin: (isAdmin: boolean) => void
) {
  // Check if the user can change their username
  const checkCanChangeUsername = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Check if user is admin first - admins can always change username
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user?.email === 'debruijneb@gmail.com') {
        setIsAdmin(true);
        setCanChangeUsername(true);
        setNextChangeDate(null);
        return;
      }
      
      // For non-admin users, check their last username change directly in the profiles table
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('last_username_change')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error checking username change date:', error);
          // En cas d'erreur, autoriser quand même mais log l'erreur
          setCanChangeUsername(true);
          return;
        }
        
        if (!data.last_username_change) {
          // Si jamais changé, autoriser
          setCanChangeUsername(true);
          return;
        }
        
        const lastChange = new Date(data.last_username_change);
        const nextAllowed = new Date(lastChange);
        nextAllowed.setMonth(nextAllowed.getMonth() + 1);
        
        setNextChangeDate(nextAllowed);
        setCanChangeUsername(nextAllowed <= new Date());
        
      } catch (error) {
        console.error('Error checking username change date:', error);
        // En cas d'erreur, autoriser quand même mais log l'erreur
        setCanChangeUsername(true);
      }
    } catch (error) {
      console.error('Error in checkCanChangeUsername:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkCanChangeUsername
  };
}
