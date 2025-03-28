
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

/**
 * Hook to manage login functionality
 */
export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [suggestedEmail, setSuggestedEmail] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fonction pour chercher un email similaire dans la base de données
  const findSimilarEmail = async (email: string): Promise<string | null> => {
    try {
      // Cette requête nécessite un accès direct à auth.users que nous n'avons pas via l'API Supabase
      // Donc nous allons plutôt implémenter une heuristique simple
      
      // Formats courants d'erreurs
      if (email.includes('@')) {
        const domain = email.split('@')[1];
        
        // Vérifier si l'email est mal tapé (avec un espace par exemple)
        const cleanedEmail = email.trim().replace(/\s+/g, '');
        if (cleanedEmail !== email) {
          return cleanedEmail;
        }
        
        // Vérifier si le domaine courant est correct
        if (domain && !domain.includes('.')) {
          // Domaine sans point, suggérer une correction
          return `${email.split('@')[0]}@${domain}.com`;
        }
      } else if (!email.includes('@')) {
        // Si l'email ne contient pas @, suggérer d'ajouter @
        return `${email}@gmail.com`;
      }
      
      return null;
    } catch (err) {
      console.error("Erreur lors de la recherche d'email similaire:", err);
      return null;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    setSuggestedEmail(null);
    
    try {
      console.log(`Tentative de connexion avec: ${email}`);
      
      // Validation basique de l'email
      if (!email.includes('@') || !email.includes('.')) {
        const suggestion = await findSimilarEmail(email);
        setSuggestedEmail(suggestion);
        setLoginError("Format d'email invalide. Veuillez entrer un email valide.");
        setIsLoading(false);
        return;
      }
      
      // Tenter la connexion directement avec l'API d'authentification Supabase
      console.log("Tentative de connexion avec l'API auth de Supabase");
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log("Résultat connexion:", 
        authData ? `Succès: ${JSON.stringify(authData)}` : "Échec", 
        error ? `Erreur: ${error.message}` : "Pas d'erreur");

      if (error) {
        // Personnaliser le message d'erreur
        if (error.message === "Invalid login credentials") {
          // Vérifier si l'utilisateur existe mais que le mot de passe est incorrect
          const { data: userExists } = await supabase.auth.signUp({
            email,
            password: `temp_password_${Date.now()}` // Mot de passe temporaire unique
          });
          
          // Si l'API renvoie une erreur de type "User already registered", cela signifie que l'email existe déjà
          if (userExists?.user === null) {
            setLoginError("Le mot de passe est incorrect. Veuillez réessayer ou utiliser la récupération de mot de passe.");
          } else {
            // Chercher un email similaire
            const similar = await findSimilarEmail(email);
            console.log("Email similaire trouvé:", similar);
            
            if (similar) {
              setSuggestedEmail(similar);
              setLoginError(`Compte non trouvé. Avez-vous voulu dire "${similar}" ?`);
            } else {
              setLoginError("Ce compte n'existe pas. Veuillez créer un compte ou vérifier votre email.");
            }
          }
        } else {
          setLoginError(`Erreur : ${error.message}`);
        }
        throw error;
      }

      toast({
        description: "Connexion réussie"
      });
      
      // Redirect to search page after successful login
      navigate('/search');
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
      // Le message d'erreur est géré au-dessus
    } finally {
      setIsLoading(false);
    }
  };

  // Réinitialiser l'erreur lors de la modification de l'email
  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    setLoginError(null);
    setSuggestedEmail(null);
  };

  const useSuggestedEmail = () => {
    if (suggestedEmail) {
      setEmail(suggestedEmail);
    }
  };

  return {
    email,
    password,
    loginError,
    suggestedEmail,
    isLoading,
    setEmail: handleEmailChange,
    setPassword,
    handleLogin,
    useSuggestedEmail
  };
}
