
import { Book } from '@/types/book';

export interface CalculatedStats {
  totalBooks: number;
  totalPages: number;
  avgPagesPerBook: number;
  monthlyData: MonthlyData[];
  readingSpeed: string;
  totalReadingTimeHours: string;
  userReadingSpeed: number;
  topAuthors: {name: string; count: number}[];
  topGenres: {name: string; count: number}[];
  booksThisYear: number;
  yearlyGoal: number;
  yearlyProgressPercentage: number;
  booksThisMonth: number;
  monthlyGoal: number;
  monthlyProgressPercentage: number;
  readingBooks: number;
  toReadBooks: number;
  totalReadingDays: number;
  avgReadingTime: string;
  readingTimeDistribution: {name: string; value: number; color: string}[];
  hasReadingTimeData: boolean;
  purchasedBooks: number;
  toBuyBooks: number;
}

export interface MonthlyData {
  name: string;
  books: number;
  pages: number;
  date: Date;
}

export interface StatsCalculatorProps {
  completedBooks: Book[];
  readingBooks: Book[];
  toReadBooks: Book[];
  selectedYear: number | null;
  children: (stats: CalculatedStats) => React.ReactNode;
}
