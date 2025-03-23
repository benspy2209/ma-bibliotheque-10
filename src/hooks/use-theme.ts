
import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Vérifier s'il y a un thème sauvegardé dans le localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    // Si aucun thème n'est sauvegardé, utiliser la préférence système ou 'light' comme valeur par défaut
    return savedTheme || 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light');
  });

  useEffect(() => {
    // Sauvegarder le thème dans le localStorage
    localStorage.setItem('theme', theme);
    
    // Appliquer la classe appropriée au document
    // Retirer les deux classes et ajouter seulement celle qui correspond au thème actuel
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
};
