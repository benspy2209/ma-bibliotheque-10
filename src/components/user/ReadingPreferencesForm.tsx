
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ReadingPreferencesFormValues {
  reading_pace: number;
  custom_reading_goal: number;
  preferred_genres: string[];
  favorite_authors: string[];
}

export function ReadingPreferencesForm() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [newGenre, setNewGenre] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  
  const form = useForm<ReadingPreferencesFormValues>({
    defaultValues: {
      reading_pace: 1,
      custom_reading_goal: 12,
      preferred_genres: [],
      favorite_authors: [],
    },
  });

  const addGenre = () => {
    if (!newGenre.trim()) return;
    
    const currentGenres = form.getValues().preferred_genres || [];
    if (!currentGenres.includes(newGenre)) {
      form.setValue('preferred_genres', [...currentGenres, newGenre]);
      setNewGenre("");
    }
  };

  const removeGenre = (genre: string) => {
    const currentGenres = form.getValues().preferred_genres || [];
    form.setValue('preferred_genres', currentGenres.filter(g => g !== genre));
  };

  const addAuthor = () => {
    if (!newAuthor.trim()) return;
    
    const currentAuthors = form.getValues().favorite_authors || [];
    if (!currentAuthors.includes(newAuthor)) {
      form.setValue('favorite_authors', [...currentAuthors, newAuthor]);
      setNewAuthor("");
    }
  };

  const removeAuthor = (author: string) => {
    const currentAuthors = form.getValues().favorite_authors || [];
    form.setValue('favorite_authors', currentAuthors.filter(a => a !== author));
  };

  // Charger les données du profil au chargement
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('reading_pace, custom_reading_goal, preferred_genres, favorite_authors')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Erreur lors du chargement des préférences de lecture:', error);
          return;
        }
        
        // Mettre à jour le formulaire avec les données existantes
        form.reset({
          reading_pace: data.reading_pace || 1,
          custom_reading_goal: data.custom_reading_goal || 12,
          preferred_genres: data.preferred_genres || [],
          favorite_authors: data.favorite_authors || [],
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
  const onSubmit = async (values: ReadingPreferencesFormValues) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          reading_pace: values.reading_pace,
          custom_reading_goal: values.custom_reading_goal,
          preferred_genres: values.preferred_genres,
          favorite_authors: values.favorite_authors,
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
      
      toast({
        description: "Préférences de lecture mises à jour avec succès!"
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
        <CardTitle>Préférences de lecture</CardTitle>
        <CardDescription>
          Personnalisez vos préférences de lecture et définissez vos objectifs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="reading_pace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rythme de lecture (livres par mois)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        disabled={isLoading} 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Combien de livres lisez-vous environ par mois?
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="custom_reading_goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objectif de lecture annuel</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        disabled={isLoading} 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Combien de livres souhaitez-vous lire cette année?
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferred_genres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genres préférés</FormLabel>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {field.value && field.value.map((genre, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {genre}
                          <button 
                            type="button" 
                            onClick={() => removeGenre(genre)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ajouter un genre"
                        value={newGenre}
                        onChange={(e) => setNewGenre(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addGenre();
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={addGenre}>
                        Ajouter
                      </Button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="favorite_authors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auteurs favoris</FormLabel>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {field.value && field.value.map((author, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {author}
                          <button 
                            type="button" 
                            onClick={() => removeAuthor(author)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ajouter un auteur"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addAuthor();
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={addAuthor}>
                        Ajouter
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
            </div>

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
