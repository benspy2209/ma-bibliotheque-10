
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
      // Essayons d'abord de récupérer la langue depuis localStorage
      const storedLanguage = localStorage.getItem('app_language') as Language | null;
      
      if (storedLanguage && (storedLanguage === 'fr' || storedLanguage === 'en')) {
        setLanguage(storedLanguage);
      }
      
      // Si l'utilisateur est connecté, chargeons sa préférence depuis la base de données
      if (user) {
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
            const userLanguage = data.language_preference as Language;
            setLanguage(userLanguage);
            // Mettons également à jour le localStorage
            localStorage.setItem('app_language', userLanguage);
          }
        } catch (error) {
          console.error('Erreur dans loadLanguagePreference:', error);
        } finally {
          setIsLoading(false);
        }
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
    // Toujours mettre à jour localStorage pour les utilisateurs connectés et non connectés
    localStorage.setItem('app_language', newLanguage);
    
    // Mettre à jour l'état local
    setLanguage(newLanguage);
    
    // Si l'utilisateur est connecté, mettre à jour la préférence en base de données
    if (user) {
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
        
        return true;
      } catch (error) {
        console.error('Erreur dans changeLanguage:', error);
        return false;
      } finally {
        setIsLoading(false);
      }
    }
    
    return true;
  }, [user]);

  return {
    language,
    t,
    changeLanguage,
    isLoading
  };
}
