
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

interface LoginErrorProps {
  errorMessage: string | null;
  suggestedEmail: string | null;
  onUseSuggestion: () => void;
}

export function LoginError({ 
  errorMessage, 
  suggestedEmail, 
  onUseSuggestion 
}: LoginErrorProps) {
  const { setAuthMode } = useSupabaseAuth();
  
  if (!errorMessage) return null;
  
  // Vérifier si le message concerne un utilisateur qui a des livres mais pas de compte
  const hasExistingBooks = errorMessage.includes("a des livres associés mais pas de compte");
  
  const handleSwitchToSignup = () => {
    setAuthMode('signup');
  };
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex flex-col gap-2">
        {errorMessage}
        
        {suggestedEmail && (
          <Button 
            type="button" 
            variant="outline"
            size="sm"
            className="self-start mt-1 text-sm"
            onClick={onUseSuggestion}
          >
            Utiliser "{suggestedEmail}"
          </Button>
        )}
        
        {hasExistingBooks && (
          <Button 
            type="button" 
            variant="default"
            size="sm"
            className="self-start mt-2 text-sm"
            onClick={handleSwitchToSignup}
          >
            S'inscrire maintenant
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
