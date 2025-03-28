
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
        // Si l'email contient déjà @, essayons avec sans @ pour voir si un tel utilisateur existe
        const noAtEmail = email.replace('@', '');
        const { error } = await supabase.auth.signInWithPassword({
          email: noAtEmail,
          password: "dummy_for_check_only"
        });
        
        // Si l'erreur est différente de "Invalid login credentials", cela peut signifier que l'email existe
        if (error && error.message !== "Invalid login credentials") {
          return noAtEmail;
        }
      } else {
        // Si l'email ne contient pas @, essayons d'ajouter @ à différents endroits
        // Exemple: si email = "benbeneloo.com", essayons "ben@beneloo.com"
        if (email.includes('.')) {
          const parts = email.split('.');
          if (parts.length > 1) {
            const domainPart = parts.pop();
            const userPart = parts.join('.');
            
            // Diviser la partie utilisateur en deux pour ajouter @ au milieu
            if (userPart.length > 2) {
              const midPoint = Math.floor(userPart.length / 2);
              const suggestedEmail = `${userPart.substring(0, midPoint)}@${userPart.substring(midPoint)}.${domainPart}`;
              
              // Vérifier si cet email existe
              const { error } = await supabase.auth.signInWithPassword({
                email: suggestedEmail,
                password: "dummy_for_check_only"
              });
              
              if (error && error.message !== "Invalid login credentials") {
                return suggestedEmail;
              }
            }
          }
        }
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
          // Chercher un email similaire
          const similar = await findSimilarEmail(email);
          console.log("Email similaire trouvé:", similar);
          
          if (similar) {
            setSuggestedEmail(similar);
            setLoginError(`Identifiants invalides. Avez-vous voulu dire "${similar}" ?`);
          } else {
            setLoginError("Ce compte n'existe pas ou le mot de passe est incorrect. Veuillez réessayer ou créer un compte.");
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
