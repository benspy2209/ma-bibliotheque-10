
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
import { useTranslation } from "@/hooks/use-translation";

interface InterfacePreferencesFormValues {
  theme_preference: 'dark' | 'light';
  language_preference: 'fr' | 'en';
}

export function InterfacePreferencesForm() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const { t, changeLanguage, language } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const form = useForm<InterfacePreferencesFormValues>({
    defaultValues: {
      theme_preference: theme as 'dark' | 'light',
      language_preference: language,
    },
  });

  // Synchroniser le formulaire avec les valeurs actuelles de la langue et du thème
  useEffect(() => {
    form.setValue('language_preference', language);
    form.setValue('theme_preference', theme as 'dark' | 'light');
  }, [language, theme, form]);

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
        if (data) {
          const themeValue = data.theme_preference === 'light' || data.theme_preference === 'dark' 
            ? data.theme_preference 
            : (theme as 'dark' | 'light');
          
          const langValue = data.language_preference === 'fr' || data.language_preference === 'en'
            ? data.language_preference
            : language;
            
          form.reset({
            theme_preference: themeValue,
            language_preference: langValue,
          });
        }
      } catch (error) {
        console.error('Erreur dans fetchProfileData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, form, language, theme]);

  // Gestion de la soumission du formulaire
  const onSubmit = async (values: InterfacePreferencesFormValues) => {
    try {
      setIsLoading(true);
      
      // Appliquer le thème si différent du thème actuel
      if (values.theme_preference !== theme) {
        toggleTheme();
      }
      
      // Appliquer la langue
      const languageChanged = values.language_preference !== language;
      if (languageChanged) {
        const success = await changeLanguage(values.language_preference);
        if (!success) {
          toast({
            variant: "destructive",
            description: t("toast.error")
          });
          setIsLoading(false);
          return;
        }
      }

      // Uniquement mettre à jour la base de données si l'utilisateur est connecté
      if (user) {
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
            description: t("toast.error")
          });
          setIsLoading(false);
          return;
        }
      }
      
      toast({
        description: t("toast.preferences_updated")
      });
      
      // Recharger la page pour appliquer les changements de langue à toute l'interface
      if (languageChanged) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Erreur dans onSubmit:', error);
      toast({
        variant: "destructive",
        description: t("toast.error")
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('interface_form.title')}</CardTitle>
        <CardDescription>
          {t('interface_form.subtitle')}
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
                  <FormLabel>{t('interface_form.theme')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="light" id="light" />
                        </FormControl>
                        <FormLabel htmlFor="light" className="flex items-center space-x-2 cursor-pointer">
                          <Sun className="h-4 w-4" />
                          <span>{t('interface_form.theme_light')}</span>
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="dark" id="dark" />
                        </FormControl>
                        <FormLabel htmlFor="dark" className="flex items-center space-x-2 cursor-pointer">
                          <Moon className="h-4 w-4" />
                          <span>{t('interface_form.theme_dark')}</span>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    {t('interface_form.theme_description')}
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="language_preference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('interface_form.language')}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('interface_form.language')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t('interface_form.language_description')}
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('interface_form.saving') : t('interface_form.save')}
                {isSaved && <CheckCircle2 className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
