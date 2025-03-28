
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
      
      // First, check if the user exists
      console.log("Checking if user exists...");
      const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers({
        filter: {
          email: email
        }
      });
      
      // Handle case where we can't check if user exists (fallback to normal sign in)
      if (getUserError) {
        console.log("Error checking if user exists, falling back to normal sign in:", getUserError);
        
        // Attempt to sign in directly
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          if (error.message === "Invalid login credentials") {
            // Get a similar email suggestion
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
          throw error;
        }
        
        toast({
          description: "Connexion réussie"
        });
        
        navigate('/search');
        return;
      }
      
      // Check if user exists in the system
      const userExists = users && users.length > 0;
      console.log("User exists check:", userExists);
      
      if (!userExists) {
        // User does not exist, suggest similar email
        const similar = await findSimilarEmail(email);
        if (similar) {
          setSuggestedEmail(similar);
          setLoginError(`Compte non trouvé. Avez-vous voulu dire "${similar}" ?`);
        } else {
          setLoginError("Ce compte n'existe pas. Veuillez créer un compte ou vérifier votre email.");
        }
        setIsLoading(false);
        return;
      }
      
      // If user exists, try to sign in
      console.log("User exists, attempting to sign in");
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log("Login result:", 
        authData ? `Success: ${JSON.stringify(authData)}` : "Failed", 
        error ? `Error: ${error.message}` : "No error");

      if (error) {
        // If user exists but login failed, it's likely a password issue
        if (error.message === "Invalid login credentials") {
          setLoginError("Le mot de passe est incorrect. Veuillez réessayer ou utiliser la récupération de mot de passe.");
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
      console.error("Authentication error:", error);
      // Error is handled above
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
