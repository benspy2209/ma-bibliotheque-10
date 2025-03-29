
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { loadBooks } from '@/services/supabaseBooks';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { useAvailableYears } from '@/hooks/use-available-years';
import { useFilteredBooks } from '@/hooks/use-filtered-books';
import { useYearSelection } from '@/hooks/use-year-selection';
import { StatisticsHeader } from '@/components/statistics/StatisticsHeader';
import { StatisticsContent } from '@/components/statistics/StatisticsContent';
import { AdminSection } from '@/components/statistics/AdminSection';

export default function Statistics() {
  const currentYear = new Date().getFullYear();

  // Force component re-render when route is accessed
  const [key, setKey] = useState(Date.now());
  
  useEffect(() => {
    // Force rerender when component mounts
    setKey(Date.now());
    // Force data refresh
    refetchBooks();
  }, []);

  const { data: books = [], refetch: refetchBooks } = useQuery({
    queryKey: ['books'],
    queryFn: loadBooks,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
    gcTime: 0,
  });

  console.log('All books loaded:', books.length, 'books');
  console.log('Book statuses:', books.map(book => ({ id: book.id, title: book.title, status: book.status })));

  // Get available years and completed books
  const { availableYears, allCompletedBooks } = useAvailableYears(books, currentYear);
  
  // Handle year selection with automatic fallback
  const { selectedYear, setSelectedYear } = useYearSelection(allCompletedBooks, currentYear);
  
  // Filter books based on selected year and status
  const { completedBooks, readingBooks, toReadBooks } = useFilteredBooks(
    books, 
    selectedYear, 
    allCompletedBooks
  );

  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="px-3 sm:px-4 lg:px-6 py-6 sm:py-8 flex-grow overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            <StatisticsHeader
              selectedYear={selectedYear}
              availableYears={availableYears}
              completedBooks={completedBooks}
              onYearSelect={setSelectedYear}
            />
            
            <AdminSection />

            <StatisticsContent
              completedBooks={completedBooks}
              readingBooks={readingBooks}
              toReadBooks={toReadBooks}
              selectedYear={selectedYear}
              allCompletedBooks={allCompletedBooks}
            />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
