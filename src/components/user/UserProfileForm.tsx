
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function UserProfileForm() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, bio, location')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile data:', error);
        return;
      }

      if (data) {
        setFullName(data.full_name || "");
        setBio(data.bio || "");
        setLocation(data.location || "");
      }
    } catch (error) {
      console.error('Error in fetchProfileData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Vérifier si un profil existe pour cet utilisateur
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 est l'erreur "no rows returned"
        console.error('Error checking profile:', checkError);
        setErrorMessage("Une erreur est survenue lors de la vérification du profil.");
        setIsSubmitting(false);
        return;
      }
      
      let updateError;
      
      // Si le profil n'existe pas, créer un nouveau profil
      if (!existingProfile) {
        console.log('Creating new profile for user:', user.id);
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: fullName,
            bio,
            location,
          });
        updateError = error;
      } else {
        // Si le profil existe, le mettre à jour
        console.log('Updating existing profile for user:', user.id);
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            bio,
            location,
          })
          .eq('id', user.id);
        updateError = error;
      }

      if (updateError) {
        console.error('Error updating profile:', updateError);
        setErrorMessage("Une erreur est survenue lors de la mise à jour du profil.");
        setIsSubmitting(false);
        return;
      }

      toast({
        description: "Profil mis à jour avec succès!"
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setErrorMessage("Une erreur est survenue lors de la mise à jour du profil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
        <CardDescription>
          Mettez à jour vos informations personnelles.
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Votre nom complet"
              disabled={isLoading || isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biographie</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Parlez-nous de vous et de vos goûts littéraires..."
              disabled={isLoading || isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localisation</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Votre ville ou pays"
              disabled={isLoading || isSubmitting}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : "Mettre à jour le profil"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
