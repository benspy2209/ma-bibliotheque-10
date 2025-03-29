
import { useState, useEffect, useMemo } from 'react';
import { Book } from '@/types/book';
import { getYear } from 'date-fns';

export function useFilteredBooks(books: Book[], selectedYear: number | null, allCompletedBooks: Book[]) {
  // Ajout d'un forceUpdate pour garantir la réactivité
  const [updateCounter, setUpdateCounter] = useState(0);
  
  // Force un recalcul lorsque les livres ou les livres complétés changent
  useEffect(() => {
    console.log("useFilteredBooks: Détection de changement dans books ou allCompletedBooks");
    setUpdateCounter(prev => prev + 1);
  }, [books, allCompletedBooks, books.length, allCompletedBooks.length]);
  
  // Ajouter un intervalle pour forcer le rafraîchissement périodique
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateCounter(prev => prev + 1);
    }, 5000); // Toutes les 5 secondes
    
    return () => clearInterval(interval);
  }, []);
  
  const completedBooks = useMemo(() => {
    console.log(`useFilteredBooks: Recalcul des livres complétés pour l'année ${selectedYear} (${updateCounter})`);
    console.log("useFilteredBooks: Nombre total de livres complétés:", allCompletedBooks.length);
    
    // Log détaillé pour le débogage
    allCompletedBooks.forEach((book, index) => {
      console.log(`Livre complété #${index + 1}:`, book.title, "Statut:", book.status, "Date de complétion:", book.completionDate);
    });
    
    if (!selectedYear) return allCompletedBooks;
    
    return allCompletedBooks.filter(book => {
      if (!book.completionDate) return false;
      const completionYear = getYear(new Date(book.completionDate));
      const matches = completionYear === selectedYear;
      return matches;
    });
  }, [selectedYear, allCompletedBooks, updateCounter]);
  
  const readingBooks = useMemo(() => {
    console.log("useFilteredBooks: Recalcul des livres en cours de lecture");
    return books.filter((book): book is Book =>
      book !== null && book.status === 'reading'
    );
  }, [books, updateCounter]);

  const toReadBooks = useMemo(() => {
    console.log("useFilteredBooks: Recalcul des livres à lire");
    return books.filter((book): book is Book =>
      book !== null && (!book.status || book.status === 'to-read')
    );
  }, [books, updateCounter]);

  return {
    completedBooks,
    readingBooks,
    toReadBooks
  };
}
