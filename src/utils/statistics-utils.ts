
import { Book } from '@/types/book';
import { MonthlyData } from '@/types/statistics';
import { format, differenceInDays, isThisMonth, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F',
  '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1'
];

export function calculateTotalPages(books: Book[]): number {
  return books.reduce((sum, book) => {
    if (!book.numberOfPages) {
      return sum;
    }
    
    const pages = Number(book.numberOfPages);
    if (isNaN(pages)) {
      return sum;
    }
    
    return sum + pages;
  }, 0);
}

export function calculateTotalReadingDays(books: Book[]): number {
  if (books.length === 0) return 0;
  
  return books.reduce((sum, book) => {
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
}

export function calculateReadingSpeed(totalPages: number, totalReadingDays: number): string {
  const calculatedReadingSpeed = totalPages / (totalReadingDays || 1);
  return calculatedReadingSpeed.toFixed(1);
}

export function calculateMonthlyData(books: Book[]): MonthlyData[] {
  const booksByMonth = books.reduce((acc, book) => {
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
  }, {} as Record<string, MonthlyData>);

  return Object.values(booksByMonth)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(-6);
}

export function calculateBooksThisMonth(books: Book[]): number {
  return books.filter(book => {
    if (!book.completionDate) return false;
    try {
      const completionDate = parseISO(book.completionDate);
      return isThisMonth(completionDate);
    } catch (error) {
      console.error('Erreur lors du filtrage par mois:', error);
      return false;
    }
  }).length;
}

export function calculateTopAuthors(books: Book[], limit: number = 5): {name: string; count: number}[] {
  const authorCounts = books.reduce((acc, book) => {
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
  
  return Object.values(authorCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function calculateTopGenres(books: Book[], limit: number = 5): {name: string; count: number}[] {
  const genreCounts = books.reduce((acc, book) => {
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
  
  return Object.values(genreCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function calculateReadingTimeDistribution(books: Book[]): {
  distribution: {name: string; value: number; color: string}[],
  hasData: boolean
} {
  const readingTimeDistribution = [
    { name: '1-7 jours', value: 0, color: '#8884d8' },
    { name: '8-14 jours', value: 0, color: '#82ca9d' },
    { name: '15-30 jours', value: 0, color: '#ffc658' },
    { name: '31+ jours', value: 0, color: '#ff8042' }
  ];
  
  books.forEach(book => {
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

  const filteredDistribution = readingTimeDistribution.filter(item => item.value > 0);
  const hasData = filteredDistribution.length > 0;

  return {
    distribution: hasData ? readingTimeDistribution : [],
    hasData
  };
}

export function calculateAverageReadingTime(books: Book[]): string {
  const booksWithReadingTime = books.filter(book => 
    (book.readingTimeDays !== undefined) || 
    (book.startReadingDate && book.completionDate)
  );
  
  if (booksWithReadingTime.length === 0) return '0';
  
  const avgReadingTime = booksWithReadingTime.reduce((sum, book) => {
    let days = book.readingTimeDays;
    if (!days && book.startReadingDate && book.completionDate) {
      days = differenceInDays(new Date(book.completionDate), new Date(book.startReadingDate)) + 1;
    }
    return sum + (days || 0);
  }, 0) / booksWithReadingTime.length;
  
  return avgReadingTime.toFixed(1);
}

// Fonction corrigée pour calculer correctement les livres achetés et à acheter
export function calculatePurchasedAndToBuyBooks(books: Book[]): { purchasedBooks: number, toBuyBooks: number } {
  // Seuls les livres "à lire" peuvent être achetés ou à acheter
  const toReadBooks = books.filter(book => !book.status || book.status === 'to-read');
  
  // Compter les livres à acheter (non achetés et status "à lire")
  const toBuyBooks = toReadBooks.filter(book => book.purchased === false).length;
  
  // Compter les livres achetés (explicitement marqués comme achetés)
  const purchasedBooks = books.filter(book => book.purchased === true).length;
  
  console.log(`Calcul des livres - Total: ${books.length}, À lire: ${toReadBooks.length}, Achetés: ${purchasedBooks}, À acheter: ${toBuyBooks}`);
  
  return { purchasedBooks, toBuyBooks };
}
