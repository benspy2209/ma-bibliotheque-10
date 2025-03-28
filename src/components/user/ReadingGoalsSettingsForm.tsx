
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, BookOpen, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useReadingGoals } from '@/hooks/use-reading-goals';

export function ReadingGoalsSettingsForm() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const { data: readingGoals, refetch } = useReadingGoals();
  const [yearlyGoal, setYearlyGoal] = useState("");
  const [monthlyGoal, setMonthlyGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (readingGoals) {
      setYearlyGoal(readingGoals.yearly_goal.toString());
      setMonthlyGoal(readingGoals.monthly_goal.toString());
    }
  }, [readingGoals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Valider les entrées
      const yearly = parseInt(yearlyGoal, 10);
      const monthly = parseInt(monthlyGoal, 10);
      
      if (isNaN(yearly) || yearly < 1 || isNaN(monthly) || monthly < 1) {
        setErrorMessage("Les objectifs doivent être des nombres positifs.");
        setIsSubmitting(false);
        return;
      }

      // Mettre à jour les objectifs via la fonction RPC
      const { error } = await supabase.rpc('upsert_reading_goals', {
        p_user_id: user.id,
        p_yearly_goal: yearly,
        p_monthly_goal: monthly
      });

      if (error) {
        console.error('Error updating reading goals:', error);
        setErrorMessage("Une erreur est survenue lors de la mise à jour des objectifs de lecture.");
        return;
      }

      // Rafraîchir les données
      await refetch();
      
      toast({
        description: "Objectifs de lecture mis à jour avec succès!"
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setErrorMessage("Une erreur est survenue lors de la mise à jour des objectifs de lecture.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResetStats = async () => {
    if (!user || !confirm("Êtes-vous sûr de vouloir réinitialiser vos statistiques de lecture ? Cette action est irréversible.")) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Mettre à jour les objectifs par défaut
      const { error } = await supabase.rpc('upsert_reading_goals', {
        p_user_id: user.id,
        p_yearly_goal: 50,
        p_monthly_goal: 4
      });

      if (error) {
        console.error('Error resetting reading goals:', error);
        setErrorMessage("Une erreur est survenue lors de la réinitialisation des statistiques.");
        return;
      }
      
      // Rafraîchir les données
      await refetch();
      
      // Réinitialiser les champs du formulaire
      setYearlyGoal("50");
      setMonthlyGoal("4");
      
      toast({
        description: "Statistiques réinitialisées avec succès!"
      });
    } catch (error) {
      console.error('Error in handleResetStats:', error);
      setErrorMessage("Une erreur est survenue lors de la réinitialisation des statistiques.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Objectifs de lecture</CardTitle>
        <CardDescription>
          Personnalisez vos objectifs de lecture annuels et mensuels.
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
            <Label htmlFor="yearlyGoal" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Objectif annuel (nombre de livres)
            </Label>
            <Input
              id="yearlyGoal"
              type="number"
              min="1"
              value={yearlyGoal}
              onChange={(e) => setYearlyGoal(e.target.value)}
              disabled={isLoading || isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyGoal" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Objectif mensuel (nombre de livres)
            </Label>
            <Input
              id="monthlyGoal"
              type="number"
              min="1" 
              value={monthlyGoal}
              onChange={(e) => setMonthlyGoal(e.target.value)}
              disabled={isLoading || isSubmitting}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : "Mettre à jour les objectifs"}
          </Button>
          
          <div className="pt-4 border-t mt-6">
            <h3 className="font-medium mb-2">Réinitialisation des données</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Vous pouvez réinitialiser vos objectifs de lecture aux valeurs par défaut.
            </p>
            <Button 
              type="button"
              variant="destructive"
              className="w-full"
              onClick={handleResetStats}
              disabled={isSubmitting}
            >
              Réinitialiser les objectifs
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
