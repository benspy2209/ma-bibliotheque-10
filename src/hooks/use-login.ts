
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

  // Function to find similar email in case of typos
  const findSimilarEmail = async (email: string): Promise<string | null> => {
    try {
      // Simple heuristic for suggesting email corrections
      if (email.includes('@')) {
        const domain = email.split('@')[1];
        
        // Check for whitespace and clean it
        const cleanedEmail = email.trim().replace(/\s+/g, '');
        if (cleanedEmail !== email) {
          return cleanedEmail;
        }
        
        // Check if domain is missing a dot
        if (domain && !domain.includes('.')) {
          return `${email.split('@')[0]}@${domain}.com`;
        }
      } else if (!email.includes('@')) {
        // If email doesn't have @, suggest adding one
        return `${email}@gmail.com`;
      }
      
      return null;
    } catch (err) {
      console.error("Error finding similar email:", err);
      return null;
    }
  };

  // Fonction pour vérifier si l'email existe dans user_books_stats
  const checkEmailInUserStats = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_books_stats')
        .select('user_email')
        .eq('user_email', email)
        .maybeSingle();
      
      if (error) {
        console.error("Erreur lors de la vérification dans user_books_stats:", error);
        return false;
      }
      
      return data !== null;
    } catch (err) {
      console.error("Exception lors de la vérification dans user_books_stats:", err);
      return false;
    }
  };

  // Fonction pour créer automatiquement un compte utilisateur
  const createUserAccount = async (email: string, password: string): Promise<{ success: boolean, error?: any }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin }
      });

      if (error) {
        console.error("Erreur lors de la création du compte:", error);
        return { success: false, error };
      }

      return { success: true };
    } catch (err) {
      console.error("Exception lors de la création du compte:", err);
      return { success: false, error: err };
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    setSuggestedEmail(null);
    
    try {
      console.log(`Tentative de connexion avec l'email: ${email}`);
      
      // Basic email validation
      if (!email.includes('@') || !email.includes('.')) {
        const suggestion = await findSimilarEmail(email);
        setSuggestedEmail(suggestion);
        setLoginError("Format d'email invalide. Veuillez entrer un email valide.");
        setIsLoading(false);
        return;
      }
      
      // Tentative de connexion à Supabase
      console.log("Tentative d'authentification avec Supabase...");
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.log("Erreur de connexion:", error.message, "Code:", error.status);
        
        if (error.message === "Invalid login credentials") {
          // Vérifier si l'email existe dans user_books_stats
          const existsInStats = await checkEmailInUserStats(email);
          
          if (existsInStats) {
            // L'utilisateur existe dans les statistiques mais n'a pas de compte d'authentification
            console.log(`L'email ${email} a des livres associés mais pas de compte d'authentification. Création automatique du compte...`);
            
            // Création automatique du compte
            const { success, error: signupError } = await createUserAccount(email, password);
            
            if (success) {
              // Tentative de connexion immédiate après la création du compte
              const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password
              });
              
              if (!loginError) {
                toast({
                  description: "Compte créé et connexion réussie"
                });
                
                navigate('/search');
                return;
              } else {
                setLoginError(`Compte créé mais erreur lors de la connexion: ${loginError.message}. Veuillez réessayer.`);
              }
            } else {
              setLoginError(`Erreur lors de la création automatique du compte: ${signupError?.message || "Erreur inconnue"}`);
            }
          } else {
            // Identifiants incorrects normaux
            setLoginError("Identifiants incorrects. Veuillez vérifier votre email et votre mot de passe.");
          }
        } else {
          setLoginError(`Erreur : ${error.message}`);
        }
        
        setIsLoading(false);
        return;
      }
      
      toast({
        description: "Connexion réussie"
      });
      
      navigate('/search');
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
      setLoginError(`Erreur inattendue: ${error.message}`);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset error when email is changed
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
