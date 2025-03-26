
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
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
import { Flame, Award, Calendar, Check, X, Calendar as CalendarIcon } from 'lucide-react';
import { 
  hasReadToday, 
  markTodayAsRead, 
  getReadingStreak, 
  getStreakStartDate,
  setStartDate,
  fillDatesUntilToday
} from '@/services/readingStreakService';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export function ReadingStreak() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCongrats, setShowCongrats] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Récupérer le streak de lecture actuel
  const { data: streak = 0, isLoading: isLoadingStreak } = useQuery({
    queryKey: ['readingStreak'],
    queryFn: getReadingStreak,
    staleTime: 60 * 1000, // 1 minute
  });

  // Récupérer la date de début de la série
  const { data: startDate, isLoading: isLoadingStartDate } = useQuery({
    queryKey: ['streakStartDate'],
    queryFn: getStreakStartDate,
    staleTime: 60 * 1000, // 1 minute
  });

  // Vérifier si l'utilisateur a déjà lu aujourd'hui
  const { data: hasRead = false, isLoading: isCheckingToday } = useQuery({
    queryKey: ['readToday'],
    queryFn: hasReadToday,
    staleTime: 60 * 1000, // 1 minute
  });

  // Mutation pour marquer comme lu
  const { mutate: markAsRead, isPending: isMarkingAsRead } = useMutation({
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

  // Mutation pour définir une date de début
  const { mutate: setStartDateMutation, isPending: isSettingStartDate } = useMutation({
    mutationFn: (date: Date) => fillDatesUntilToday(date),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['readingStreak'] });
        queryClient.invalidateQueries({ queryKey: ['readToday'] });
        queryClient.invalidateQueries({ queryKey: ['streakStartDate'] });
        
        toast({
          title: "Date de début définie ! 📆",
          description: "Votre série de lecture a été mise à jour avec succès !",
        });
        
        setShowStartDatePicker(false);
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
        description: "Impossible de définir la date de début. Veuillez réessayer.",
      });
    }
  });

  const handleMarkAsRead = () => {
    markAsRead();
  };

  const handleMarkAsNotRead = () => {
    toast({
      variant: "default",
      title: "Pas de lecture aujourd'hui",
      description: "Pas de problème ! Vous pouvez toujours revenir demain pour maintenir votre série.",
    });
  };

  const handleSetStartDate = () => {
    if (selectedDate) {
      setStartDateMutation(selectedDate);
    }
  };

  const isLoading = isLoadingStreak || isCheckingToday || isMarkingAsRead || isLoadingStartDate || isSettingStartDate;

  // Formater la date de début pour l'affichage
  const formattedStartDate = startDate 
    ? format(new Date(startDate), 'dd MMMM yyyy', { locale: fr }) 
    : 'Non définie';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xs text-muted-foreground">Date de début:</span>
          <span className="text-xs font-medium">{formattedStartDate}</span>
        </div>

        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs" 
            onClick={() => setShowStartDatePicker(true)}
          >
            Modifier la date de début
          </Button>
        </div>

        {showStartDatePicker && (
          <div className="border rounded-md p-3 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Définir une date de début</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowStartDatePicker(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "dd MMMM yyyy", { locale: fr })
                    ) : (
                      <span>Sélectionnez une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date > today}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              <Button 
                onClick={handleSetStartDate} 
                disabled={!selectedDate || isSettingStartDate}
              >
                Confirmer la date
              </Button>
            </div>
          </div>
        )}
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
          <div className="w-full space-y-2">
            <p className="text-sm text-center">Avez-vous lu aujourd'hui ?</p>
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={handleMarkAsRead} 
                disabled={isLoading} 
                className="flex-1"
                variant="default"
              >
                <Check className="mr-1 h-4 w-4" />
                Oui
              </Button>
              <Button 
                onClick={handleMarkAsNotRead} 
                disabled={isLoading} 
                className="flex-1"
                variant="outline"
              >
                <X className="mr-1 h-4 w-4" />
                Non
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
