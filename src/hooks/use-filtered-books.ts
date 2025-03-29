
import { useState, useEffect, useMemo } from 'react';
import { Book } from '@/types/book';
import { getYear } from 'date-fns';

export function useFilteredBooks(books: Book[], selectedYear: number | null, allCompletedBooks: Book[]) {
  // Ajout d'un forceUpdate pour garantir la réactivité
  const [updateCounter, setUpdateCounter] = useState(0);
  
  // Force un recalcul lorsque les livres ou les livres complétés changent
  useEffect(() => {
    setUpdateCounter(prev => prev + 1);
  }, [books.length, allCompletedBooks.length]);
  
  const completedBooks = useMemo(() => {
    console.log(`Recalculating completed books for year (${updateCounter}):`, selectedYear);
    console.log("All completed books count:", allCompletedBooks.length);
    
    if (!selectedYear) return allCompletedBooks;
    
    return allCompletedBooks.filter(book => {
      if (!book.completionDate) return false;
      const completionYear = getYear(new Date(book.completionDate));
      const matches = completionYear === selectedYear;
      return matches;
    });
  }, [selectedYear, allCompletedBooks, updateCounter]);
  
  const readingBooks = useMemo(() => {
    return books.filter((book): book is Book =>
      book !== null && book.status === 'reading'
    );
  }, [books, updateCounter]);

  const toReadBooks = useMemo(() => {
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
