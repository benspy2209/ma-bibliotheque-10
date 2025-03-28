
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
      console.log(`Attempting login with email: ${email}`);
      
      // Basic email validation
      if (!email.includes('@') || !email.includes('.')) {
        const suggestion = await findSimilarEmail(email);
        setSuggestedEmail(suggestion);
        setLoginError("Format d'email invalide. Veuillez entrer un email valide.");
        setIsLoading(false);
        return;
      }
      
      // We'll directly attempt to sign in and handle errors appropriately
      // This is the recommended approach rather than trying to check if a user exists first
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.log("Login error:", error.message);
        
        if (error.message === "Invalid login credentials") {
          // This could be either wrong password or non-existent account
          // Let's try to suggest a similar email in case it's a typo
          const similar = await findSimilarEmail(email);
          if (similar) {
            setSuggestedEmail(similar);
            setLoginError(`Compte non trouvé. Avez-vous voulu dire "${similar}" ?`);
          } else {
            setLoginError("Ce compte n'existe pas ou le mot de passe est incorrect. Veuillez vérifier vos identifiants.");
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
      console.error("Authentication error:", error);
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
