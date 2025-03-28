
import { useMemo } from 'react';
import { Book } from '@/types/book';
import { useReadingSpeed } from '@/hooks/use-reading-speed';
import { useReadingGoals } from '@/hooks/use-reading-goals';
import { format, differenceInDays, getYear, differenceInMonths, isThisMonth, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface CalculatedStats {
  totalBooks: number;
  totalPages: number;
  avgPagesPerBook: number;
  monthlyData: any[];
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
  purchasedBooks: number; // Nouvelle statistique
  toBuyBooks: number;     // Nouvelle statistique
}

interface StatsCalculatorProps {
  completedBooks: Book[];
  readingBooks: Book[];
  toReadBooks: Book[];
  selectedYear: number | null;
  children: (stats: CalculatedStats) => React.ReactNode;
}

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F',
  '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1'
];

export function StatsCalculator({ 
  completedBooks, 
  readingBooks, 
  toReadBooks,
  selectedYear,
  children 
}: StatsCalculatorProps) {
  const { readingSpeed } = useReadingSpeed();
  const { data: readingGoals } = useReadingGoals();

  const stats = useMemo(() => {
    const totalBooks = completedBooks.length;
    
    const totalPages = completedBooks.reduce((sum, book) => {
      if (!book.numberOfPages) {
        return sum;
      }
      
      const pages = Number(book.numberOfPages);
      if (isNaN(pages)) {
        return sum;
      }
      
      return sum + pages;
    }, 0);
    
    const avgPagesPerBook = totalBooks > 0 ? Math.round(totalPages / totalBooks) : 0;

    let totalReadingDays = 0;
    let calculatedReadingSpeed = 0;

    if (completedBooks.length > 0) {
      totalReadingDays = completedBooks.reduce((sum, book) => {
        if (book.readingTimeDays) {
          return sum + book.readingTimeDays;
        } else if (book.startReadingDate && book.completionDate) {
          const startDate = new Date(book.startReadingDate);
          const endDate = new Date(book.completionDate);
          const daysDiff = Math.max(1, differenceInDays(endDate, startDate) + 1);
          return sum + daysDiff;
        } else if (book.completionDate) {
          return sum + 14; // Default estimate if no specific data
        }
        return sum;
      }, 0);
      
      calculatedReadingSpeed = totalPages / (totalReadingDays || 1);
    }

    const pagesPerHour = readingSpeed;
    const totalReadingTimeHoursNum = totalPages / pagesPerHour;
    const totalReadingTimeHoursFormatted = totalReadingTimeHoursNum.toFixed(1);

    const booksByMonth = completedBooks.reduce((acc, book) => {
      if (!book.completionDate) return acc;
      
      try {
        const completionDate = parseISO(book.completionDate);
        const monthKey = format(completionDate, 'MMMM yyyy', { locale: fr });
        
        if (!acc[monthKey]) {
          acc[monthKey] = {
            name: monthKey,
            books: 0,
            pages: 0,
            date: completionDate
          };
        }
        acc[monthKey].books += 1;
        
        const pages = Number(book.numberOfPages || 0);
        acc[monthKey].pages += !isNaN(pages) ? pages : 0;
        
        if (isThisMonth(completionDate)) {
          console.log('Livre du mois courant:', book.title, '- Date:', book.completionDate);
        }
      } catch (error) {
        console.error('Erreur de date pour le livre:', book.title, '- Date:', book.completionDate, error);
      }
      
      return acc;
    }, {} as Record<string, { name: string; books: number; pages: number; date: Date }>);

    const booksThisMonth = completedBooks.filter(book => {
      if (!book.completionDate) return false;
      try {
        const completionDate = parseISO(book.completionDate);
        return isThisMonth(completionDate);
      } catch (error) {
        console.error('Erreur lors du filtrage par mois:', error);
        return false;
      }
    }).length;

    const monthlyData = Object.values(booksByMonth)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(-6);

    const authorCounts = completedBooks.reduce((acc, book) => {
      const authors = Array.isArray(book.author) ? book.author : [book.author];
      
      authors.forEach(author => {
        if (!author) return;
        if (!acc[author]) {
          acc[author] = { name: author, count: 0 };
        }
        acc[author].count += 1;
      });
      
      return acc;
    }, {} as Record<string, { name: string; count: number }>);
    
    const topAuthors = Object.values(authorCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const genreCounts = completedBooks.reduce((acc, book) => {
      const subjects = book.subjects || [];
      
      subjects.forEach(subject => {
        if (!subject) return;
        if (!acc[subject]) {
          acc[subject] = { name: subject, count: 0 };
        }
        acc[subject].count += 1;
      });
      
      return acc;
    }, {} as Record<string, { name: string; count: number }>);
    
    const topGenres = Object.values(genreCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const currentYear = getYear(new Date());
    const booksThisYear = completedBooks.filter(book => 
      book.completionDate && getYear(parseISO(book.completionDate)) === currentYear
    ).length;

    const yearlyGoal = readingGoals.yearly_goal;
    const yearlyProgressPercentage = Math.min(100, (booksThisYear / yearlyGoal) * 100);

    const monthlyGoal = readingGoals.monthly_goal;
    const monthlyProgressPercentage = Math.min(100, (booksThisMonth / monthlyGoal) * 100);

    // Nouvelles statistiques d'achat
    const purchasedBooks = [...completedBooks, ...readingBooks, ...toReadBooks].filter(book => book.purchased === true).length;
    const toBuyBooks = [...completedBooks, ...readingBooks, ...toReadBooks].filter(book => book.purchased === false).length;

    const booksWithReadingTime = completedBooks.filter(book => 
      (book.readingTimeDays !== undefined) || 
      (book.startReadingDate && book.completionDate)
    );
    
    const avgReadingTime = booksWithReadingTime.length > 0 
      ? booksWithReadingTime.reduce((sum, book) => {
          let days = book.readingTimeDays;
          if (!days && book.startReadingDate && book.completionDate) {
            days = differenceInDays(new Date(book.completionDate), new Date(book.startReadingDate)) + 1;
          }
          return sum + (days || 0);
        }, 0) / booksWithReadingTime.length
      : 0;
    
    const readingTimeDistribution = [
      { name: '1-7 jours', value: 0, color: '#8884d8' },
      { name: '8-14 jours', value: 0, color: '#82ca9d' },
      { name: '15-30 jours', value: 0, color: '#ffc658' },
      { name: '31+ jours', value: 0, color: '#ff8042' }
    ];
    
    completedBooks.forEach(book => {
      let days = book.readingTimeDays;
      
      if (days === undefined && book.startReadingDate && book.completionDate) {
        days = differenceInDays(new Date(book.completionDate), new Date(book.startReadingDate)) + 1;
      }
      
      if (days !== undefined) {
        if (days <= 7) {
          readingTimeDistribution[0].value++;
        } else if (days <= 14) {
          readingTimeDistribution[1].value++;
        } else if (days <= 30) {
          readingTimeDistribution[2].value++;
        } else {
          readingTimeDistribution[3].value++;
        }
      }
    });

    const filteredReadingTimeDistribution = readingTimeDistribution.filter(item => item.value > 0);
    const hasReadingTimeData = filteredReadingTimeDistribution.length > 0;

    return {
      totalBooks,
      totalPages,
      avgPagesPerBook,
      monthlyData,
      readingSpeed: calculatedReadingSpeed.toFixed(1),
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
      avgReadingTime: avgReadingTime.toFixed(1),
      readingTimeDistribution: hasReadingTimeData ? readingTimeDistribution : [],
      hasReadingTimeData,
      purchasedBooks, // Nouvelle statistique ajoutée
      toBuyBooks      // Nouvelle statistique ajoutée
    };
  }, [completedBooks, readingBooks, toReadBooks, readingGoals, readingSpeed]);

  return <>{children(stats)}</>;
}
