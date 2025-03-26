
import { useEffect, useState } from 'react';

// Valeur par défaut : 30 pages par heure
const DEFAULT_READING_SPEED = 30;
const READING_SPEED_KEY = 'user-reading-speed';

export function useReadingSpeed() {
  const [readingSpeed, setReadingSpeed] = useState<number>(DEFAULT_READING_SPEED);

  useEffect(() => {
    // Récupérer la vitesse de lecture sauvegardée
    const savedSpeed = localStorage.getItem(READING_SPEED_KEY);
    if (savedSpeed) {
      try {
        const speed = parseInt(savedSpeed, 10);
        if (!isNaN(speed) && speed > 0) {
          setReadingSpeed(speed);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la vitesse de lecture:', error);
      }
    }
  }, []);

  const updateReadingSpeed = (newSpeed: number) => {
    if (newSpeed > 0) {
      setReadingSpeed(newSpeed);
      localStorage.setItem(READING_SPEED_KEY, newSpeed.toString());
      console.log('Vitesse de lecture mise à jour:', newSpeed);
    }
  };

  return {
    readingSpeed,
    updateReadingSpeed
  };
}
