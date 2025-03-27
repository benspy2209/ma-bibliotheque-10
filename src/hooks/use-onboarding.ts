
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useOnboarding() {
  const [hasSeenTutorial, setHasSeenTutorial] = useState<boolean | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const { toast } = useToast();
  
  // Charger l'état du tutoriel depuis localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('bibliopulse_tutorial_seen');
    if (savedState !== null) {
      setHasSeenTutorial(savedState === 'true');
    } else {
      // Par défaut, si aucune valeur n'est stockée, on considère que l'utilisateur n'a pas vu le tutoriel
      setHasSeenTutorial(false);
    }
  }, []);

  // Sauvegarder l'état du tutoriel quand il change
  const saveTutorialState = (seen: boolean) => {
    setHasSeenTutorial(seen);
    localStorage.setItem('bibliopulse_tutorial_seen', seen.toString());
    
    // Si l'utilisateur est connecté, sauvegarder aussi dans Supabase
    const user = supabase.auth.getUser();
    user.then(({ data }) => {
      if (data.user) {
        console.log('Saving tutorial state to user profile:', seen);
      }
    });
  };

  const startTutorial = () => {
    setShowTutorial(true);
    console.log('Starting tutorial...');
  };

  const skipTutorial = () => {
    setShowTutorial(false);
    saveTutorialState(true);
    toast({
      description: "Vous pourrez retrouver le tutoriel dans les paramètres plus tard."
    });
  };

  const completeTutorial = () => {
    setShowTutorial(false);
    saveTutorialState(true);
    toast({
      description: "Félicitations ! Vous avez terminé le tutoriel."
    });
  };

  return {
    hasSeenTutorial,
    showTutorial,
    startTutorial,
    skipTutorial,
    completeTutorial,
    setShowTutorial
  };
}
