
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    setSuggestedEmail(null);
    
    try {
      console.log(`Tentative de connexion avec l'email: ${email} et mot de passe: ${password.length} caractères`);
      
      // Basic email validation
      if (!email.includes('@') || !email.includes('.')) {
        const suggestion = await findSimilarEmail(email);
        setSuggestedEmail(suggestion);
        setLoginError("Format d'email invalide. Veuillez entrer un email valide.");
        setIsLoading(false);
        return;
      }
      
      // Connexion à Supabase
      console.log("Tentative d'authentification avec Supabase...");
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.log("Erreur de connexion:", error.message, "Code:", error.status);
        
        if (error.message === "Invalid login credentials") {
          // Vérifiez si le compte existe sans donner d'informations sensibles
          try {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email,
              password: `temporary-check-password-${Date.now()}`,
              options: { emailRedirectTo: window.location.origin }
            });
            
            if (signUpError && signUpError.message.includes('already')) {
              console.log("Le compte existe bien, c'est donc un problème de mot de passe");
              setLoginError(`Le mot de passe est incorrect pour le compte ${email}. Veuillez réessayer ou utiliser "Mot de passe oublié" pour le réinitialiser.`);
            } else {
              setLoginError(`Identifiants incorrects. Veuillez vérifier votre email et votre mot de passe.`);
            }
          } catch (err) {
            console.error("Erreur lors de la vérification de l'existence du compte:", err);
            setLoginError(`Identifiants incorrects. Veuillez vérifier votre email et votre mot de passe.`);
          }
        } else {
          setLoginError(`Erreur : ${error.message}`);
        }
        return;
      }
      
      toast({
        description: "Connexion réussie"
      });
      
      navigate('/search');
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
      setLoginError(`Erreur inattendue: ${error.message}`);
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
