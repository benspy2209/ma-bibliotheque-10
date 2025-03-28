
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
  | "admin_update_username";  // Added the new RPC function here

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
  const [nextChangeDate, setNextChangeDate] = useState<Date | null>(null);
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
        setCanChangeUsername(true); // Admin can always change username
      }
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
      
      // Check if user is admin first - admins can always change username
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user?.email === 'debruijneb@gmail.com') {
        setIsAdmin(true);
        setCanChangeUsername(true);
        setNextChangeDate(null);
        return;
      }
      
      // For non-admin users, check their last username change directly in the profiles table
      // This avoids calling RPC functions that might have permission issues
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
      
      // Check if user can change username
      if (!isAdminUser && !canChangeUsername) {
        toast({
          variant: "destructive",
          description: "Vous ne pouvez modifier votre nom d'utilisateur qu'une fois par mois."
        });
        return false;
      }
      
      // For admin users, we'll use a special approach
      // Note: We're using a direct RPC call to bypass RLS
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
      
      // Only check limitations for non-admins
      if (!isAdminUser) {
        await checkCanChangeUsername();
      }
      
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
