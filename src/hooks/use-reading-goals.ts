
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReadingGoalRow } from '@/types/supabase';

interface ReadingGoals {
  yearly_goal: number;
  monthly_goal: number;
}

const DEFAULT_GOALS = {
  yearly_goal: 50,
  monthly_goal: 4
};

export function useReadingGoals() {
  const fetchReadingGoals = async (): Promise<ReadingGoals> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        return DEFAULT_GOALS;
      }

      // Utiliser une requête SQL brute pour éviter les erreurs de typage
      const { data, error } = await supabase.rpc('fetch_reading_goals', {
        p_user_id: user.user.id
      });

      if (error || !data) {
        console.error("Erreur lors de la récupération des objectifs:", error);
        return DEFAULT_GOALS;
      }

      return {
        yearly_goal: data.yearly_goal,
        monthly_goal: data.monthly_goal
      };
    } catch (error) {
      console.error("Error fetching reading goals:", error);
      return DEFAULT_GOALS;
    }
  };

  return useQuery({
    queryKey: ['readingGoals'],
    queryFn: fetchReadingGoals,
    initialData: DEFAULT_GOALS,
  });
}
