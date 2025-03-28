
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Moon, Sun } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";

interface InterfacePreferencesFormValues {
  theme_preference: 'dark' | 'light';
  language_preference: 'fr' | 'en';
}

export function InterfacePreferencesForm() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const form = useForm<InterfacePreferencesFormValues>({
    defaultValues: {
      theme_preference: 'dark',
      language_preference: 'fr',
    },
  });

  // Charger les données du profil au chargement
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('theme_preference, language_preference')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Erreur lors du chargement des préférences d\'interface:', error);
          return;
        }
        
        // Mettre à jour le formulaire avec les données existantes
        form.reset({
          theme_preference: (data.theme_preference as 'dark' | 'light') || 'dark',
          language_preference: (data.language_preference as 'fr' | 'en') || 'fr',
        });
      } catch (error) {
        console.error('Erreur dans fetchProfileData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, form]);

  // Gestion de la soumission du formulaire
  const onSubmit = async (values: InterfacePreferencesFormValues) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          theme_preference: values.theme_preference,
          language_preference: values.language_preference,
        })
        .eq('id', user.id);
        
      if (error) {
        console.error('Erreur lors de la mise à jour des préférences:', error);
        toast({
          variant: "destructive",
          description: "Une erreur est survenue lors de la mise à jour des préférences."
        });
        return;
      }
      
      // Appliquer le thème si différent du thème actuel
      if (values.theme_preference !== theme) {
        toggleTheme();
      }
      
      toast({
        description: "Préférences d'interface mises à jour avec succès!"
      });
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Erreur dans onSubmit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Personnalisation de l'interface</CardTitle>
        <CardDescription>
          Modifiez l'apparence et la langue de l'application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="theme_preference"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Thème</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="light" id="light" />
                        </FormControl>
                        <FormLabel htmlFor="light" className="flex items-center space-x-2 cursor-pointer">
                          <Sun className="h-4 w-4" />
                          <span>Clair</span>
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="dark" id="dark" />
                        </FormControl>
                        <FormLabel htmlFor="dark" className="flex items-center space-x-2 cursor-pointer">
                          <Moon className="h-4 w-4" />
                          <span>Sombre</span>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Choisissez le thème qui vous convient le mieux.
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="language_preference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Langue</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une langue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    La langue de l'interface utilisateur.
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer les préférences"}
                {isSaved && <CheckCircle2 className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
