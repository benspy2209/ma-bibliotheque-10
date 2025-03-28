
import { User } from "@supabase/supabase-js";

export const useUserDisplay = (user: User | null) => {
  // Récupérer le prénom de l'utilisateur ou utiliser son email
  const getUserDisplayName = () => {
    if (!user) return "";
    
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
    
    const displayName = getUserDisplayName();
    return displayName.substring(0, 2).toUpperCase();
  };

  return {
    getUserDisplayName,
    getInitials
  };
};
