
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useSupabaseAuth } from './use-supabase-auth';

interface UsernameChangeResponse {
  can_change: boolean;
  last_change: string | null;
  next_allowed: string | null;
}

// This helps TypeScript recognize our custom RPC function
type CustomRPC = 
  | "can_change_username" 
  | "can_perform_search" 
  | "fetch_reading_goals" 
  | "get_all_users_statistics" 
  | "get_reading_streak" 
  | "increment_search_count" 
  | "upsert_reading_goals"
  | "admin_update_username";

// Extend the supabase client type to include our custom RPC
declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    rpc<T = any>(fn: CustomRPC, params?: object): { data: T; error: Error };
  }
}

export function useUsername() {
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
      }
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
      
      // Check if user is admin
      const { data: userData } = await supabase.auth.getUser();
      const isAdminUser = userData?.user?.email === 'debruijneb@gmail.com';
      
      // For admin users, we'll use a special approach
      if (isAdminUser) {
        try {
          // Call an RPC function for admin username update
          const { error } = await supabase.rpc('admin_update_username', {
            user_id: user.id,
            new_username: newUsername
          });
          
          if (error) {
            console.error('Error updating admin username with RPC:', error);
            
            // Fallback to standard update if RPC fails
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ 
                username: newUsername 
              })
              .eq('id', user.id);
              
            if (updateError) {
              console.error('Error in fallback update for admin:', updateError);
              toast({
                variant: "destructive",
                description: "Une erreur est survenue lors de la mise à jour du nom d'utilisateur administrateur."
              });
              return false;
            }
          }
        } catch (error) {
          console.error('Exception in admin username update:', error);
          toast({
            variant: "destructive",
            description: "Une erreur est survenue lors de la mise à jour du nom d'utilisateur administrateur."
          });
          return false;
        }
      } else {
        // For regular users, use standard update
        const { error } = await supabase
          .from('profiles')
          .update({ username: newUsername })
          .eq('id', user.id);
          
        if (error) {
          console.error('Error updating username:', error);
          toast({
            variant: "destructive",
            description: "Une erreur est survenue lors de la mise à jour du nom d'utilisateur."
          });
          return false;
        }
      }
      
      setUsername(newUsername);
      
      toast({
        description: "Nom d'utilisateur mis à jour avec succès!"
      });
      
      return true;
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
