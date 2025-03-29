
import { useState, useEffect, useMemo } from 'react';
import { Book } from '@/types/book';
import { getYear } from 'date-fns';

export function useFilteredBooks(books: Book[], selectedYear: number | null, allCompletedBooks: Book[]) {
  const completedBooks = useMemo(() => {
    console.log("Recalculating completed books for year:", selectedYear);
    console.log("All completed books count:", allCompletedBooks.length);
    
    if (!selectedYear) return allCompletedBooks;
    
    return allCompletedBooks.filter(book => {
      if (!book.completionDate) return false;
      const completionYear = getYear(new Date(book.completionDate));
      const matches = completionYear === selectedYear;
      return matches;
    });
  }, [selectedYear, allCompletedBooks]);
  
  const readingBooks = useMemo(() => {
    return books.filter((book): book is Book =>
      book !== null && book.status === 'reading'
    );
  }, [books]);

  const toReadBooks = useMemo(() => {
    return books.filter((book): book is Book =>
      book !== null && (!book.status || book.status === 'to-read')
    );
  }, [books]);

  return {
    completedBooks,
    readingBooks,
    toReadBooks
  };
}
