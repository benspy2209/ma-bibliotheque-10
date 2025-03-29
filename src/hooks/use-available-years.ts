
import { useState, useEffect, useMemo } from 'react';
import { Book } from '@/types/book';
import { getYear } from 'date-fns';

export function useAvailableYears(books: Book[], currentYear: number) {
  // Ajout d'un forceUpdate pour garantir que le hook recalcule même si les références ne changent pas
  const [forceUpdate, setForceUpdate] = useState(Date.now());
  
  // Force un recalcul quand books change ou toutes les 2 secondes (réduit de 3s à 2s)
  useEffect(() => {
    console.log("useAvailableYears: Détection de changement dans les livres");
    setForceUpdate(Date.now());
    
    const interval = setInterval(() => {
      setForceUpdate(Date.now());
    }, 2000);
    
    return () => clearInterval(interval);
  }, [books, books.length]);
  
  const allCompletedBooks = useMemo(() => {
    console.log(`useAvailableYears: Calcul de tous les livres complétés (${forceUpdate})`);
    console.log("useAvailableYears: Nombre total de livres:", books.length);
    
    const completed = books.filter((book): book is Book => 
      book !== null && book.status === 'completed'
    );
    
    console.log("useAvailableYears: Livres complétés trouvés:", completed.length);
    
    // Log détaillé pour le débogage
    completed.forEach((book, index) => {
      console.log(`Livre complété #${index + 1}:`, book.title, "Date de complétion:", book.completionDate);
    });
    
    return completed;
  }, [books, forceUpdate]);
  
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    
    allCompletedBooks.forEach(book => {
      if (book.completionDate) {
        const year = getYear(new Date(book.completionDate));
        years.add(year);
        console.log(`useAvailableYears: Ajout de l'année ${year} pour le livre ${book.title}`);
      }
    });
    
    years.add(currentYear);
    
    if (years.size === 0) {
      years.add(currentYear);
    }
    
    // Ensure all years between min year and current year are included
    for (let year = Math.max(1977, Math.min(...Array.from(years))); year <= currentYear; year++) {
      years.add(year);
    }
    
    const sortedYears = Array.from(years).sort((a, b) => b - a);
    console.log(`useAvailableYears: Années disponibles (${forceUpdate}):`, sortedYears);
    return sortedYears;
  }, [allCompletedBooks, currentYear, forceUpdate]);

  return {
    availableYears,
    allCompletedBooks
  };
}
