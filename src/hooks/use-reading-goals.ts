
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

      const { data, error } = await supabase
        .from('reading_goals')
        .select('yearly_goal, monthly_goal')
        .eq('user_id', user.user.id)
        .maybeSingle();

      if (error || !data) {
        console.error("Erreur lors de la récupération des objectifs:", error);
        return DEFAULT_GOALS;
      }

      return data as ReadingGoals;
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
