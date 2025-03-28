
import { useState, useEffect, useCallback } from 'react';
import { getTranslation } from '@/utils/translation';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './use-supabase-auth';

type Language = 'fr' | 'en';

export function useTranslation() {
  const { user } = useSupabaseAuth();
  const [language, setLanguage] = useState<Language>('fr');
  const [isLoading, setIsLoading] = useState(false);

  // Charger la préférence de langue de l'utilisateur
  useEffect(() => {
    const loadLanguagePreference = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('language_preference')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erreur lors du chargement de la préférence de langue:', error);
          return;
        }

        if (data && data.language_preference) {
          setLanguage(data.language_preference as Language);
        }
      } catch (error) {
        console.error('Erreur dans loadLanguagePreference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguagePreference();
  }, [user]);

  // Traduire un texte
  const t = useCallback((key: string): string => {
    return getTranslation(key, language);
  }, [language]);

  // Changer la langue
  const changeLanguage = useCallback(async (newLanguage: Language): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ language_preference: newLanguage })
        .eq('id', user.id);
        
      if (error) {
        console.error('Erreur lors de la mise à jour de la langue:', error);
        return false;
      }
      
      setLanguage(newLanguage);
      return true;
    } catch (error) {
      console.error('Erreur dans changeLanguage:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    language,
    t,
    changeLanguage,
    isLoading
  };
}
