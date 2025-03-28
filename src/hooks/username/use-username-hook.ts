
import { useEffect, useState } from 'react';
import { useToast } from '../use-toast';
import { useSupabaseAuth } from '../use-supabase-auth';
import { 
  fetchUserUsername, 
  isAdminUser, 
  isUsernameTaken, 
  updateAdminUsername, 
  updateRegularUsername 
} from './username-utils';
import { UsernameHookReturn } from './username-types';

export function useUsernameHook(): UsernameHookReturn {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const { user } = useSupabaseAuth();

  // Fetch the current username
  const fetchUsername = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Fetch username
      const fetchedUsername = await fetchUserUsername(user.id);
      setUsername(fetchedUsername);
      
      // Check if user is admin
      const adminStatus = await isAdminUser(user);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error in fetchUsername:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the user's username
  const updateUsername = async (newUsername: string) => {
    if (!user) return false;
    if (!newUsername.trim()) {
      toast({
        variant: "destructive",
        description: "Le nom d'utilisateur ne peut pas être vide."
      });
      return false;
    }
    
    try {
      setIsLoading(true);
      
      // Check if username is already taken
      const taken = await isUsernameTaken(newUsername, user.id);
      if (taken) {
        toast({
          variant: "destructive",
          description: "Ce nom d'utilisateur est déjà pris."
        });
        return false;
      }
      
      // Check if user is admin
      const adminStatus = await isAdminUser(user);
      
      // Update username based on user type
      let success;
      if (adminStatus) {
        success = await updateAdminUsername(user.id, newUsername);
      } else {
        success = await updateRegularUsername(user.id, newUsername);
      }
      
      if (success) {
        setUsername(newUsername);
        toast({
          description: "Nom d'utilisateur mis à jour avec succès!"
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error in updateUsername:', error);
      toast({
        variant: "destructive",
        description: "Une erreur est survenue lors de la mise à jour du nom d'utilisateur."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data when user changes
  useEffect(() => {
    if (user) {
      fetchUsername();
    } else {
      setUsername(null);
      setCanChangeUsername(true);
      setIsAdmin(false);
    }
  }, [user]);

  return {
    username,
    isLoading,
    canChangeUsername,
    isAdmin,
    updateUsername,
    fetchUsername
  };
}
