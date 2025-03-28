
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

export function useUsernameUpdate(
  user: User | null,
  username: string | null,
  setUsername: (username: string | null) => void,
  isAdmin: boolean,
  canChangeUsername: boolean,
  setIsLoading: (loading: boolean) => void,
  checkCanChangeUsername: () => Promise<void>
) {
  const { toast } = useToast();

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

  return {
    updateUsername
  };
}
