
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

// Check if user is admin
export const isAdminUser = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  const { data: userData } = await supabase.auth.getUser();
  return userData?.user?.email === 'debruijneb@gmail.com';
};

// Fetch username from database
export const fetchUserUsername = async (userId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching username:', error);
    return null;
  }
  
  return data.username;
};

// Check if username is already taken by another user
export const isUsernameTaken = async (username: string, userId: string): Promise<boolean> => {
  const { data: existingUser, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .not('id', 'eq', userId)
    .maybeSingle();
    
  if (error) {
    console.error('Error checking existing username:', error);
    toast({
      variant: "destructive",
      description: "Une erreur est survenue lors de la vérification du nom d'utilisateur."
    });
    return true;
  }
  
  return !!existingUser;
};

// Update username for admin users
export const updateAdminUsername = async (userId: string, newUsername: string): Promise<boolean> => {
  try {
    // Call an RPC function for admin username update
    const { error } = await supabase.rpc('admin_update_username', {
      user_id: userId,
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
        .eq('id', userId);
        
      if (updateError) {
        console.error('Error in fallback update for admin:', updateError);
        toast({
          variant: "destructive",
          description: "Une erreur est survenue lors de la mise à jour du nom d'utilisateur administrateur."
        });
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Exception in admin username update:', error);
    toast({
      variant: "destructive",
      description: "Une erreur est survenue lors de la mise à jour du nom d'utilisateur administrateur."
    });
    return false;
  }
};

// Update username for regular users
export const updateRegularUsername = async (userId: string, newUsername: string): Promise<boolean> => {
  const { error } = await supabase
    .from('profiles')
    .update({ username: newUsername })
    .eq('id', userId);
    
  if (error) {
    console.error('Error updating username:', error);
    toast({
      variant: "destructive",
      description: "Une erreur est survenue lors de la mise à jour du nom d'utilisateur."
    });
    return false;
  }
  
  return true;
};
