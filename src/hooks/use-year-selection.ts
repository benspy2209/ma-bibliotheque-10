
import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { getYear } from 'date-fns';

export function useYearSelection(allCompletedBooks: Book[], currentYear: number) {
  const [selectedYear, setSelectedYear] = useState<number | null>(currentYear);

  useEffect(() => {
    if (selectedYear === currentYear) {
      const booksForCurrentYear = allCompletedBooks.some(book => {
        if (!book.completionDate) return false;
        return getYear(new Date(book.completionDate)) === currentYear;
      });
      
      if (!booksForCurrentYear && allCompletedBooks.length > 0) {
        const years = allCompletedBooks
          .filter(book => book.completionDate)
          .map(book => getYear(new Date(book.completionDate!)))
          .sort((a, b) => b - a);
        
        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      }
    }
  }, [allCompletedBooks, currentYear, selectedYear]);

  return {
    selectedYear,
    setSelectedYear
  };
}
