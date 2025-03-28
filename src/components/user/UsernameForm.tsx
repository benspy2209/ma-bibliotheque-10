
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, InfoIcon } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useUsername } from "@/hooks/use-username";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useUserDisplay } from "@/components/navbar/UserUtils";

export function UsernameForm() {
  const { username, isLoading, canChangeUsername, nextChangeDate, isAdmin, updateUsername } = useUsername();
  const { user } = useSupabaseAuth();
  const { refreshUsername } = useUserDisplay(user);
  const [newUsername, setNewUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (username) {
      setNewUsername(username);
    }
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const success = await updateUsername(newUsername);
      if (success) {
        // Refresh the username display in the navbar
        refreshUsername();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatNextChangeDate = () => {
    if (!nextChangeDate) return "";
    return format(nextChangeDate, "dd MMMM yyyy", { locale: fr });
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
            : isAdmin 
              ? "En tant qu'administrateur, vous pouvez modifier votre nom d'utilisateur à tout moment."
              : "Vous pouvez modifier votre nom d'utilisateur une fois par mois."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isFirstTimeSettingUsername && !canChangeUsername && nextChangeDate && !isAdmin && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Vous ne pouvez modifier votre nom d'utilisateur qu'une fois par mois. 
              Prochain changement possible à partir du {formatNextChangeDate()}.
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
              disabled={isLoading || isSubmitting || (!isFirstTimeSettingUsername && !canChangeUsername && !isAdmin)}
            />
          </div>

          <div className="mt-4 text-sm text-muted-foreground flex items-start gap-2">
            <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              {isAdmin 
                ? "En tant qu'administrateur, vous pouvez modifier votre nom d'utilisateur à tout moment."
                : "Votre nom d'utilisateur sera visible par les autres utilisateurs et ne peut être modifié qu'une fois par mois."}
            </span>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-4"
            disabled={isLoading || isSubmitting || (!isFirstTimeSettingUsername && !canChangeUsername && !isAdmin) || newUsername === username}
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
