
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { supabase } from '@/integrations/supabase/client';

export function UserProfileForm() {
  const { user } = useSupabaseAuth();
  const [username, setUsername] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data && data.username) {
          setUsername(data.username);
          setCurrentUsername(data.username);
        }
      } catch (error: any) {
        console.error("Erreur lors de la récupération du profil:", error);
        toast({
          variant: "destructive",
          description: `Erreur : ${error.message}`
        });
      }
    };
    
    fetchProfile();
  }, [user]);

  // Fonction pour vérifier la disponibilité du nom d'utilisateur
  const checkUsernameAvailability = async (username: string) => {
    if (!username.trim() || username === currentUsername) {
      setUsernameError(null);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setUsernameError('Ce pseudo est déjà utilisé');
      } else {
        setUsernameError(null);
      }
    } catch (error: any) {
      console.error("Erreur lors de la vérification du pseudo:", error);
      setUsernameError(`Erreur lors de la vérification: ${error.message}`);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Si le pseudo n'a pas changé, ne rien faire
    if (username === currentUsername) {
      toast({
        description: "Aucune modification n'a été effectuée"
      });
      return;
    }
    
    setIsLoading(true);
    setSuccessMessage(null);
    
    try {
      // Vérifier à nouveau la disponibilité du pseudo
      if (username && username !== currentUsername) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setUsernameError('Ce pseudo est déjà utilisé');
          setIsLoading(false);
          return;
        }
      }
      
      // Mettre à jour le profil
      const { error } = await supabase
        .from('profiles')
        .update({ 
          username: username || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setCurrentUsername(username);
      setSuccessMessage("Votre profil a été mis à jour avec succès.");
      toast({
        description: "Profil mis à jour avec succès"
      });
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast({
        variant: "destructive",
        description: `Erreur : ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Votre profil</CardTitle>
        <CardDescription>
          Personnalisez votre identité sur BiblioPulse
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveProfile}>
          {successMessage && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2 mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              L'adresse email ne peut pas être modifiée.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Pseudo</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => checkUsernameAvailability(username)}
              placeholder="Choisissez un pseudo unique"
              disabled={isLoading}
              aria-describedby={usernameError ? "username-error" : undefined}
            />
            {usernameError && (
              <p id="username-error" className="text-sm text-destructive mt-1">
                {usernameError}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Votre pseudo sera visible par les autres utilisateurs.
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6" 
            disabled={isLoading || !!usernameError || username === currentUsername}
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour: {new Date().toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  );
}
