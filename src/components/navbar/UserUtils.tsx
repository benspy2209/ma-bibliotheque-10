
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const useUserDisplay = (user: User | null) => {
  const [username, setUsername] = useState<string | null>(null);

  // Fetch the username when the user changes
  useEffect(() => {
    const fetchUsername = async () => {
      if (!user) {
        setUsername(null);
        return;
      }

      try {
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
      }
    };

    fetchUsername();
  }, [user]);

  // Récupérer le nom d'utilisateur ou utiliser son email
  const getUserDisplayName = () => {
    if (!user) return "";
    
    // Si l'utilisateur a un nom d'utilisateur
    if (username) return username;
    
    // Si l'utilisateur a un prénom dans les métadonnées
    const firstName = user.user_metadata?.first_name;
    if (firstName) return firstName;
    
    // Vérifier également le nom complet et extraire le prénom
    const fullName = user.user_metadata?.full_name;
    if (fullName && typeof fullName === 'string') {
      const firstNameFromFull = fullName.split(' ')[0];
      if (firstNameFromFull) return firstNameFromFull;
    }
    
    // Sinon, utiliser l'email et extraire la partie avant @
    return user.email ? user.email.split('@')[0] : "Utilisateur";
  };

  // Obtenir les initiales pour l'avatar
  const getInitials = () => {
    if (!user) return "";
    
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    
    const displayName = getUserDisplayName();
    return displayName.substring(0, 2).toUpperCase();
  };

  return {
    getUserDisplayName,
    getInitials,
    username
  };
};
