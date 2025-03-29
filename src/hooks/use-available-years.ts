
import { useState, useEffect, useMemo } from 'react';
import { Book } from '@/types/book';
import { getYear } from 'date-fns';

export function useAvailableYears(books: Book[], currentYear: number) {
  const allCompletedBooks = useMemo(() => {
    console.log("Calculating all completed books from total books:", books.length);
    const completed = books.filter((book): book is Book => 
      book !== null && book.status === 'completed'
    );
    console.log("Found completed books:", completed.length);
    return completed;
  }, [books]);
  
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
    
    const sortedYears = Array.from(years).sort((a, b) => b - a);
    console.log("Available years:", sortedYears);
    return sortedYears;
  }, [allCompletedBooks, currentYear]);

  return {
    availableYears,
    allCompletedBooks
  };
}
