
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

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
  if (!errorMessage) return null;
  
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
      </AlertDescription>
    </Alert>
  );
}
