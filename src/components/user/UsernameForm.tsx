import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, InfoIcon } from "lucide-react";
import { useUsername } from "@/hooks/use-username";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useUserDisplay } from "@/components/navbar/UserUtils";

export function UsernameForm() {
  const { username, isLoading, updateUsername } = useUsername();
  const { user } = useSupabaseAuth();
  const { refreshUsername } = useUserDisplay(user);
  const [newUsername, setNewUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      setNewUsername(username);
    }
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const success = await updateUsername(newUsername);
      if (success) {
        // Refresh the username display in the navbar
        refreshUsername();
      } else {
        setErrorMessage("Une erreur est survenue lors de la mise à jour du nom d'utilisateur.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom d'utilisateur:", error);
      setErrorMessage("Une erreur est survenue lors de la mise à jour du nom d'utilisateur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFirstTimeSettingUsername = username === null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {isFirstTimeSettingUsername ? "Définir votre nom d'utilisateur" : "Modifier votre nom d'utilisateur"}
        </CardTitle>
        <CardDescription>
          {isFirstTimeSettingUsername 
            ? "Choisissez un nom d'utilisateur unique pour votre compte." 
            : "Vous pouvez modifier votre nom d'utilisateur à tout moment."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
              disabled={isLoading || isSubmitting}
            />
          </div>

          <div className="mt-4 text-sm text-muted-foreground flex items-start gap-2">
            <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              Votre nom d'utilisateur sera visible par les autres utilisateurs.
            </span>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-4"
            disabled={isLoading || isSubmitting || newUsername === username}
          >
            {isSubmitting 
              ? "Enregistrement..." 
              : isFirstTimeSettingUsername 
                ? "Définir le nom d'utilisateur" 
                : "Modifier le nom d'utilisateur"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
