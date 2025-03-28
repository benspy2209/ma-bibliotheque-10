
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, BookOpen } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useReadingSpeed } from '@/hooks/use-reading-speed';

const BOOK_FORMATS = [
  { id: "paper", label: "Papier" },
  { id: "ebook", label: "Ebook" },
  { id: "audio", label: "Audio" }
];

export function ReadingPreferencesForm() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const { readingSpeed, updateReadingSpeed } = useReadingSpeed();
  const [favoriteAuthors, setFavoriteAuthors] = useState<string>("");
  const [preferredGenres, setPreferredGenres] = useState<string>("");
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [customReadingSpeed, setCustomReadingSpeed] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchReadingPreferences();
    }
    setCustomReadingSpeed(readingSpeed.toString());
  }, [user, readingSpeed]);

  const fetchReadingPreferences = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('favorite_authors, preferred_genres, reading_pace')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching reading preferences:', error);
        return;
      }

      if (data) {
        setFavoriteAuthors(data.favorite_authors ? data.favorite_authors.join(", ") : "");
        setPreferredGenres(data.preferred_genres ? data.preferred_genres.join(", ") : "");
        
        if (data.reading_pace) {
          setCustomReadingSpeed(data.reading_pace.toString());
        }
      }
    } catch (error) {
      console.error('Error in fetchReadingPreferences:', error);
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
      // Parse la vitesse de lecture
      const speed = parseInt(customReadingSpeed, 10);
      if (!isNaN(speed) && speed > 0) {
        updateReadingSpeed(speed);
      } else {
        setErrorMessage("La vitesse de lecture doit être un nombre positif.");
        setIsSubmitting(false);
        return;
      }

      // Préparer les données
      const authorsArray = favoriteAuthors
        .split(',')
        .map(author => author.trim())
        .filter(author => author.length > 0);

      const genresArray = preferredGenres
        .split(',')
        .map(genre => genre.trim())
        .filter(genre => genre.length > 0);

      const { error } = await supabase
        .from('profiles')
        .update({
          favorite_authors: authorsArray,
          preferred_genres: genresArray,
          reading_pace: speed
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating reading preferences:', error);
        setErrorMessage("Une erreur est survenue lors de la mise à jour des préférences de lecture.");
        return;
      }

      toast({
        description: "Préférences de lecture mises à jour avec succès!"
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setErrorMessage("Une erreur est survenue lors de la mise à jour des préférences de lecture.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFormat = (format: string) => {
    setSelectedFormats(current => 
      current.includes(format)
        ? current.filter(f => f !== format)
        : [...current, format]
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Préférences de lecture</CardTitle>
        <CardDescription>
          Personnalisez vos habitudes et préférences de lecture.
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
            <Label htmlFor="favoriteAuthors">Auteurs favoris (séparés par des virgules)</Label>
            <Input
              id="favoriteAuthors"
              value={favoriteAuthors}
              onChange={(e) => setFavoriteAuthors(e.target.value)}
              placeholder="Victor Hugo, J.K. Rowling, Dostoïevski..."
              disabled={isLoading || isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredGenres">Genres préférés (séparés par des virgules)</Label>
            <Input
              id="preferredGenres"
              value={preferredGenres}
              onChange={(e) => setPreferredGenres(e.target.value)}
              placeholder="Science-fiction, Policier, Romance..."
              disabled={isLoading || isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bookFormats">Formats de livre préférés</Label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {BOOK_FORMATS.map((format) => (
                <div className="flex items-center space-x-2" key={format.id}>
                  <Checkbox 
                    id={format.id} 
                    checked={selectedFormats.includes(format.id)}
                    onCheckedChange={() => toggleFormat(format.id)}
                  />
                  <Label htmlFor={format.id} className="cursor-pointer">
                    {format.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="readingSpeed" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Vitesse de lecture (pages par heure)
            </Label>
            <Input
              id="readingSpeed"
              type="number"
              min="1"
              value={customReadingSpeed}
              onChange={(e) => setCustomReadingSpeed(e.target.value)}
              disabled={isLoading || isSubmitting}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Cette valeur est utilisée pour estimer le temps de lecture dans vos statistiques.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : "Mettre à jour les préférences"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
