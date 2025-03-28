
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUserDisplay = (user: User | null) => {
  const [username, setUsername] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUsername = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error("Erreur lors de la récupération du profil:", error);
          return;
        }
        
        if (data && data.username) {
          setUsername(data.username);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du pseudo:", error);
      }
    };
    
    fetchUsername();
  }, [user]);

  // Récupérer le prénom de l'utilisateur ou utiliser son pseudo ou email
  const getUserDisplayName = () => {
    if (!user) return "";
    
    // Si l'utilisateur a un pseudo
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
      // Utilisez les deux premières lettres du pseudo s'il existe
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
