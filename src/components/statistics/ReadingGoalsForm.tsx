
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReadingGoalsFormProps {
  yearlyGoal: number;
  monthlyGoal: number;
}

export function ReadingGoalsForm({ yearlyGoal, monthlyGoal }: ReadingGoalsFormProps) {
  const [newYearlyGoal, setNewYearlyGoal] = useState(yearlyGoal);
  const [newMonthlyGoal, setNewMonthlyGoal] = useState(monthlyGoal);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSaveGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Vous devez être connecté pour effectuer cette action");
      }
      
      // Utilisez la fonction RPC pour la mise à jour
      const { error } = await supabase.rpc('upsert_reading_goals', {
        p_user_id: user.id,
        p_yearly_goal: newYearlyGoal,
        p_monthly_goal: newMonthlyGoal
      });

      if (error) throw error;

      toast({
        description: "Objectifs de lecture mis à jour",
      });

      // Force refresh of goals data
      queryClient.invalidateQueries({ queryKey: ['readingGoals'] });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des objectifs:", error);
      toast({
        variant: "destructive",
        description: "Une erreur est survenue lors de la mise à jour des objectifs",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Pencil className="h-3.5 w-3.5 mr-1.5" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Objectifs de lecture</DialogTitle>
          <DialogDescription>
            Définissez vos objectifs de lecture annuels et mensuels.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="yearly-goal">Objectif annuel (livres)</Label>
            <Input
              id="yearly-goal"
              type="number"
              min="1"
              value={newYearlyGoal}
              onChange={(e) => setNewYearlyGoal(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthly-goal">Objectif mensuel (livres)</Label>
            <Input
              id="monthly-goal"
              type="number"
              min="1"
              value={newMonthlyGoal}
              onChange={(e) => setNewMonthlyGoal(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleSaveGoals}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
