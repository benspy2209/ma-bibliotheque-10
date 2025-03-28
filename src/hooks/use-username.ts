
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useSupabaseAuth } from './use-supabase-auth';

interface UsernameChangeResponse {
  can_change: boolean;
  last_change: string | null;
  next_allowed: string | null;
}

export function useUsername() {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [nextChangeDate, setNextChangeDate] = useState<Date | null>(null);
  const { toast } = useToast();
  const { user } = useSupabaseAuth();

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
    } catch (error) {
      console.error('Error in fetchUsername:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if the user can change their username
  const checkCanChangeUsername = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .rpc('can_change_username', { user_id: user.id });
        
      if (error) {
        console.error('Error checking username change ability:', error);
        return;
      }
      
      const response = data as UsernameChangeResponse;
      setCanChangeUsername(response.can_change);
      
      if (response.next_allowed) {
        setNextChangeDate(new Date(response.next_allowed));
      }
    } catch (error) {
      console.error('Error in checkCanChangeUsername:', error);
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
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', newUsername)
        .not('id', 'eq', user.id)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking existing username:', checkError);
        toast({
          variant: "destructive",
          description: "Une erreur est survenue lors de la vérification du nom d'utilisateur."
        });
        return false;
      }
      
      if (existingUser) {
        toast({
          variant: "destructive",
          description: "Ce nom d'utilisateur est déjà pris."
        });
        return false;
      }
      
      // Update the username
      const { error } = await supabase
        .from('profiles')
        .update({ username: newUsername })
        .eq('id', user.id);
        
      if (error) {
        console.error('Error updating username:', error);
        
        // Check if error is due to frequency limitation
        if (error.message.includes('once per month')) {
          toast({
            variant: "destructive",
            description: error.message
          });
          await checkCanChangeUsername(); // Refresh the limitation status
        } else {
          toast({
            variant: "destructive",
            description: "Une erreur est survenue lors de la mise à jour du nom d'utilisateur."
          });
        }
        
        return false;
      }
      
      setUsername(newUsername);
      await checkCanChangeUsername(); // Refresh the limitation status
      
      toast({
        description: "Nom d'utilisateur mis à jour avec succès!"
      });
      
      return true;
    } catch (error) {
      console.error('Error in updateUsername:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data when user changes
  useEffect(() => {
    if (user) {
      fetchUsername();
      checkCanChangeUsername();
    } else {
      setUsername(null);
      setCanChangeUsername(true);
      setNextChangeDate(null);
    }
  }, [user]);

  return {
    username,
    isLoading,
    canChangeUsername,
    nextChangeDate,
    updateUsername,
    fetchUsername,
    checkCanChangeUsername
  };
}
