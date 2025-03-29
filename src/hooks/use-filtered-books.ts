
import { useState, useEffect, useMemo } from 'react';
import { Book } from '@/types/book';
import { getYear } from 'date-fns';

export function useFilteredBooks(books: Book[], selectedYear: number | null, allCompletedBooks: Book[]) {
  const [updateCounter, setUpdateCounter] = useState(0);
  
  useEffect(() => {
    console.log("useFilteredBooks: Détection de changement dans books ou allCompletedBooks");
    console.log(`useFilteredBooks: Nombre total de livres: ${books.length}, complétés: ${allCompletedBooks.length}`);
    setUpdateCounter(prev => prev + 1);
  }, [books, allCompletedBooks, books.length, allCompletedBooks.length]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateCounter(prev => prev + 1);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const completedBooks = useMemo(() => {
    console.log(`useFilteredBooks: Recalcul des livres complétés pour l'année ${selectedYear} (${updateCounter})`);
    console.log("useFilteredBooks: Nombre total de livres complétés:", allCompletedBooks.length);
    
    if (!selectedYear) return allCompletedBooks;
    
    return allCompletedBooks.filter(book => {
      if (!book.completionDate) return false;
      const completionYear = getYear(new Date(book.completionDate));
      const matches = completionYear === selectedYear;
      if (matches) {
        console.log(`Livre correspondant à l'année ${selectedYear}:`, book.title);
      }
      return matches;
    });
  }, [selectedYear, allCompletedBooks, updateCounter]);
  
  const readingBooks = useMemo(() => {
    console.log("useFilteredBooks: Recalcul des livres en cours de lecture");
    const result = books.filter((book): book is Book =>
      book !== null && book.status === 'reading'
    );
    console.log(`Livres en cours de lecture trouvés: ${result.length}`);
    return result;
  }, [books, updateCounter]);

  const toReadBooks = useMemo(() => {
    console.log("useFilteredBooks: Recalcul des livres à lire");
    const result = books.filter((book): book is Book =>
      book !== null && (!book.status || book.status === 'to-read')
    );
    console.log(`Livres à lire trouvés: ${result.length}`);
    return result;
  }, [books, updateCounter]);
  
  const purchasedBooks = useMemo(() => {
    // Include books explicitly marked as purchased OR completed books (which are implicitly purchased)
    const result = books.filter(book => 
      book.purchased || book.status === 'completed' || book.status === 'reading'
    );
    console.log(`Livres achetés trouvés: ${result.length}`);
    return result;
  }, [books, updateCounter]);
  
  const toBuyBooks = useMemo(() => {
    // Only include books that are neither purchased nor completed/reading
    const result = books.filter(book => 
      !book.purchased && book.status !== 'completed' && book.status !== 'reading'
    );
    console.log(`Livres à acheter trouvés: ${result.length}`);
    return result;
  }, [books, updateCounter]);

  return {
    completedBooks,
    readingBooks,
    toReadBooks,
    purchasedBooks,
    toBuyBooks
  };
}
