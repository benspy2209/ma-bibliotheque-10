
import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Vérifier s'il y a un thème sauvegardé dans le localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    // Si aucun thème n'est sauvegardé, utiliser 'dark' comme valeur par défaut
    return savedTheme || 'dark';
  });

  useEffect(() => {
    // Sauvegarder le thème dans le localStorage
    localStorage.setItem('theme', theme);
    
    // Pour le thème système, déterminer s'il faut utiliser dark ou light
    let effectiveTheme = theme;
    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      
      // Ajouter un écouteur pour les changements de préférence système
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);
      
      // Nettoyer l'écouteur
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    // Appliquer la classe appropriée au document
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(effectiveTheme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      // Cycle entre les thèmes : dark -> light -> system -> dark
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'system';
      return 'dark';
    });
  };

  return { theme, toggleTheme, setTheme };
};
