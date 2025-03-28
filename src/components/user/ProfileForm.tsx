
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormValues {
  full_name: string;
  bio: string;
  location: string;
  website: string;
}

export function ProfileForm() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      full_name: '',
      bio: '',
      location: '',
      website: '',
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
          .select('full_name, bio, location, website')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Erreur lors du chargement du profil:', error);
          return;
        }
        
        // Mettre à jour le formulaire avec les données existantes
        form.reset({
          full_name: data.full_name || '',
          bio: data.bio || '',
          location: data.location || '',
          website: data.website || '',
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
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          bio: values.bio,
          location: values.location,
          website: values.website,
        })
        .eq('id', user.id);
        
      if (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        toast({
          variant: "destructive",
          description: "Une erreur est survenue lors de la mise à jour du profil."
        });
        return;
      }
      
      toast({
        description: "Informations du profil mises à jour avec succès!"
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
        <CardTitle>Informations personnelles</CardTitle>
        <CardDescription>
          Modifiez vos informations personnelles qui seront affichées sur votre profil.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Votre nom complet" 
                      disabled={isLoading} 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Ce nom sera utilisé pour vous identifier sur votre profil.
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biographie</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Parlez un peu de vous et de vos goûts de lecture..." 
                      disabled={isLoading} 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localisation</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Paris, France" 
                      disabled={isLoading} 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site web</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://monsite.fr" 
                      disabled={isLoading} 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                {isSaved && <CheckCircle2 className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
