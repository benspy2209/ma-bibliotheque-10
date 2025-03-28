
import { useState, useEffect, useMemo } from 'react';
import { Book } from '@/types/book';
import { getYear } from 'date-fns';

export function useAvailableYears(books: Book[], currentYear: number) {
  const allCompletedBooks = books.filter((book): book is Book => 
    book !== null && book.status === 'completed'
  );
  
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    
    allCompletedBooks.forEach(book => {
      if (book.completionDate) {
        const year = getYear(new Date(book.completionDate));
        years.add(year);
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
    
    return Array.from(years).sort((a, b) => b - a);
  }, [allCompletedBooks, currentYear]);

  return {
    availableYears,
    allCompletedBooks
  };
}
