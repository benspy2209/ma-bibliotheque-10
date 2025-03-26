
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Flame, Award, Calendar, Check } from 'lucide-react';
import { hasReadToday, markTodayAsRead, getReadingStreak } from '@/services/readingStreakService';

export function ReadingStreak() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCongrats, setShowCongrats] = useState(false);

  // Récupérer le streak de lecture actuel
  const { data: streak = 0, isLoading: isLoadingStreak } = useQuery({
    queryKey: ['readingStreak'],
    queryFn: getReadingStreak,
    staleTime: 60 * 1000, // 1 minute
  });

  // Vérifier si l'utilisateur a déjà lu aujourd'hui
  const { data: hasRead = false, isLoading: isCheckingToday } = useQuery({
    queryKey: ['readToday'],
    queryFn: hasReadToday,
    staleTime: 60 * 1000, // 1 minute
  });

  // Mutation pour marquer comme lu
  const { mutate, isPending } = useMutation({
    mutationFn: markTodayAsRead,
    onSuccess: (data) => {
      if (data.success) {
        setShowCongrats(true);
        queryClient.invalidateQueries({ queryKey: ['readingStreak'] });
        queryClient.invalidateQueries({ queryKey: ['readToday'] });
        
        toast({
          title: "Félicitations ! 🎉",
          description: "Vous avez maintenu votre habitude de lecture aujourd'hui !",
        });
        
        // Masquer le message de félicitations après 5 secondes
        setTimeout(() => {
          setShowCongrats(false);
        }, 5000);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: data.message,
        });
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer votre lecture aujourd'hui. Veuillez réessayer.",
      });
    }
  });

  const handleMarkAsRead = () => {
    mutate();
  };

  const isLoading = isLoadingStreak || isCheckingToday || isPending;

  return (
    <Card className="relative overflow-hidden">
      {showCongrats && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/80 to-blue-500/80 flex items-center justify-center z-10 animate-in fade-in duration-500">
          <div className="text-center p-4 text-white">
            <Award className="h-12 w-12 mx-auto mb-2" />
            <h3 className="text-xl font-bold mb-1">Bravo !</h3>
            <p>Vous avez maintenu votre série pendant {streak} jour{streak > 1 ? 's' : ''} !</p>
          </div>
        </div>
      )}
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">Série de lecture</CardTitle>
          <CardDescription>Votre série de jours consécutifs</CardDescription>
        </div>
        <Flame className="h-5 w-5 text-orange-500" />
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Jours consécutifs
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{streak}</span>
              <span className="text-sm text-muted-foreground">jour{streak !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="h-14 w-14 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
            <Flame className="h-8 w-8" />
          </div>
        </div>
        
        <Progress value={Math.min(100, (streak / 30) * 100)} className="h-2" />
        
        <div className="text-xs text-muted-foreground">
          {streak === 0 
            ? "Commencez votre série aujourd'hui !" 
            : `Encore ${30 - (streak % 30)} jours pour atteindre votre prochain jalon de 30 jours`}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        {hasRead ? (
          <div className="w-full flex items-center justify-between p-2 rounded-md bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>Vous avez déjà lu aujourd'hui</span>
            </div>
            <Calendar className="h-4 w-4" />
          </div>
        ) : (
          <Button 
            onClick={handleMarkAsRead} 
            disabled={isLoading} 
            className="w-full"
          >
            Avez-vous lu aujourd'hui ?
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
