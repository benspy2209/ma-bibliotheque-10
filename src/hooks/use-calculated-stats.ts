
import { useMemo } from 'react';
import { Book } from '@/types/book';
import { CalculatedStats } from '@/types/statistics';
import { useReadingSpeed } from '@/hooks/use-reading-speed';
import { useReadingGoals } from '@/hooks/use-reading-goals';
import { getYear } from 'date-fns';
import {
  calculateTotalPages,
  calculateTotalReadingDays,
  calculateReadingSpeed,
  calculateMonthlyData,
  calculateBooksThisMonth,
  calculateTopAuthors,
  calculateTopGenres,
  calculateReadingTimeDistribution,
  calculateAverageReadingTime,
  calculatePurchasedAndToBuyBooks
} from '@/utils/statistics-utils';

export function useCalculatedStats(
  completedBooks: Book[],
  readingBooks: Book[],
  toReadBooks: Book[],
  selectedYear: number | null
): CalculatedStats {
  const { readingSpeed } = useReadingSpeed();
  const { data: readingGoals } = useReadingGoals();

  return useMemo(() => {
    const totalBooks = completedBooks.length;
    const totalPages = calculateTotalPages(completedBooks);
    const avgPagesPerBook = totalBooks > 0 ? Math.round(totalPages / totalBooks) : 0;
    const totalReadingDays = calculateTotalReadingDays(completedBooks);
    const calculatedReadingSpeedValue = calculateReadingSpeed(totalPages, totalReadingDays);
    
    const pagesPerHour = readingSpeed;
    const totalReadingTimeHoursNum = totalPages / pagesPerHour;
    const totalReadingTimeHoursFormatted = totalReadingTimeHoursNum.toFixed(1);

    const monthlyData = calculateMonthlyData(completedBooks);
    const booksThisMonth = calculateBooksThisMonth(completedBooks);
    const topAuthors = calculateTopAuthors(completedBooks);
    const topGenres = calculateTopGenres(completedBooks);

    const currentYear = getYear(new Date());
    const booksThisYear = completedBooks.filter(book => 
      book.completionDate && getYear(new Date(book.completionDate)) === currentYear
    ).length;

    const yearlyGoal = readingGoals.yearly_goal;
    const yearlyProgressPercentage = Math.min(100, (booksThisYear / yearlyGoal) * 100);

    const monthlyGoal = readingGoals.monthly_goal;
    const monthlyProgressPercentage = Math.min(100, (booksThisMonth / monthlyGoal) * 100);

    const avgReadingTime = calculateAverageReadingTime(completedBooks);
    
    const { distribution: readingTimeDistribution, hasData: hasReadingTimeData } = 
      calculateReadingTimeDistribution(completedBooks);
      
    const { purchasedBooks, toBuyBooks } = calculatePurchasedAndToBuyBooks(toReadBooks);

    return {
      totalBooks,
      totalPages,
      avgPagesPerBook,
      monthlyData,
      readingSpeed: calculatedReadingSpeedValue,
      totalReadingTimeHours: totalReadingTimeHoursFormatted,
      userReadingSpeed: readingSpeed,
      topAuthors,
      topGenres,
      booksThisYear,
      yearlyGoal,
      yearlyProgressPercentage,
      booksThisMonth,
      monthlyGoal,
      monthlyProgressPercentage,
      readingBooks: readingBooks.length,
      toReadBooks: toReadBooks.length,
      totalReadingDays,
      avgReadingTime,
      readingTimeDistribution,
      hasReadingTimeData,
      purchasedBooks,
      toBuyBooks
    };
  }, [completedBooks, readingBooks, toReadBooks, readingGoals, readingSpeed]);
}
