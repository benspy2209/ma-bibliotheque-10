
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

      const { data, error } = await supabase.rpc('fetch_reading_goals', {
        p_user_id: user.user.id
      });

      if (error || !data) {
        console.error("Erreur lors de la récupération des objectifs:", error);
        return DEFAULT_GOALS;
      }

      // Ensure we're properly parsing the JSON data returned from the function
      // The data is already a parsed JSON object from the SQL function
      return {
        yearly_goal: typeof data.yearly_goal === 'number' ? data.yearly_goal : DEFAULT_GOALS.yearly_goal,
        monthly_goal: typeof data.monthly_goal === 'number' ? data.monthly_goal : DEFAULT_GOALS.monthly_goal
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
