
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, Sun, Moon, LayoutGrid, List } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme, Theme } from "@/hooks/use-theme";
import { useViewPreference } from "@/hooks/use-view-preference";

export function DisplaySettingsForm() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const { viewMode, toggleView } = useViewPreference();
  const [selectedTheme, setSelectedTheme] = useState<Theme>(theme);
  const [selectedView, setSelectedView] = useState(viewMode);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDisplaySettings();
    }
  }, [user]);

  // When theme global state changes, update our local state
  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  const fetchDisplaySettings = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('theme_preference')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching display settings:', error);
        return;
      }

      if (data && data.theme_preference) {
        const themeValue = data.theme_preference === 'light' || data.theme_preference === 'dark' 
          ? data.theme_preference as Theme
          : theme;
        setSelectedTheme(themeValue);
      }
    } catch (error) {
      console.error('Error in fetchDisplaySettings:', error);
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
      // Toggle theme if necessary to match selected theme
      if (theme !== selectedTheme) {
        toggleTheme(); // This will switch between light and dark
      }
      
      // Update library display mode
      if (viewMode !== selectedView) {
        toggleView();
      }
      
      // Save preferences to the database
      // First check if profile exists
      const { data: profileExists, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // If error is not 'no rows returned', it's a real error
        console.error('Error checking profile:', checkError);
        setErrorMessage("Une erreur est survenue lors de la vérification du profil.");
        return;
      }

      let result;
      
      if (!profileExists) {
        // Create new profile
        result = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            theme_preference: selectedTheme
          });
      } else {
        // Update existing profile
        result = await supabase
          .from('profiles')
          .update({
            theme_preference: selectedTheme
          })
          .eq('id', user.id);
      }

      if (result.error) {
        console.error('Error updating display settings:', result.error);
        setErrorMessage("Une erreur est survenue lors de la mise à jour des paramètres d'affichage.");
        return;
      }

      toast({
        description: "Paramètres d'affichage mis à jour avec succès!"
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setErrorMessage("Une erreur est survenue lors de la mise à jour des paramètres d'affichage.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Paramètres d'affichage</CardTitle>
        <CardDescription>
          Personnalisez l'apparence de l'application.
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Thème</Label>
            <RadioGroup 
              value={selectedTheme} 
              onValueChange={(value) => setSelectedTheme(value as Theme)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center cursor-pointer">
                  <Sun className="h-4 w-4 mr-2" />
                  Clair
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center cursor-pointer">
                  <Moon className="h-4 w-4 mr-2" />
                  Sombre
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label>Format d'affichage par défaut de la bibliothèque</Label>
            <RadioGroup 
              value={selectedView} 
              onValueChange={(value) => setSelectedView(value as "grid" | "list")}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grid" id="grid" />
                <Label htmlFor="grid" className="flex items-center cursor-pointer">
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Grille
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="list" id="list" />
                <Label htmlFor="list" className="flex items-center cursor-pointer">
                  <List className="h-4 w-4 mr-2" />
                  Liste
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : "Mettre à jour les paramètres"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
