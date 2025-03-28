
import { useEffect } from 'react';
import { useSupabaseAuth } from './use-supabase-auth';
import { useUsernameState } from './username/use-username-state';
import { useUsernamePermissions } from './username/use-username-permissions';
import { useUsernameUpdate } from './username/use-username-update';

export function useUsername() {
  const { user } = useSupabaseAuth();
  
  const {
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
  } = useUsernameState(user);

  const { checkCanChangeUsername } = useUsernamePermissions(
    user,
    setIsLoading,
    setCanChangeUsername,
    setNextChangeDate,
    setIsAdmin
  );

  const { updateUsername } = useUsernameUpdate(
    user,
    username,
    setUsername,
    isAdmin,
    canChangeUsername,
    setIsLoading,
    checkCanChangeUsername
  );

  // Load initial data when user changes
  useEffect(() => {
    if (user) {
      fetchUsername();
      checkCanChangeUsername();
    } else {
      setUsername(null);
      setCanChangeUsername(true);
      setNextChangeDate(null);
      setIsAdmin(false);
    }
  }, [user]);

  return {
    username,
    isLoading,
    canChangeUsername,
    nextChangeDate,
    isAdmin,
    updateUsername,
    fetchUsername,
    checkCanChangeUsername
  };
}
