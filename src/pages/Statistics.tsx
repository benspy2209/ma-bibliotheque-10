
import { useState, useEffect, useCallback } from 'react';
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
  
  const forceRefresh = useCallback(() => {
    console.log("Statistics: Forçage du rafraîchissement...");
    setKey(Date.now());
    refetchBooks();
  }, []);
  
  useEffect(() => {
    // Force rerender when component mounts
    console.log("Statistics: Composant monté, forçage du rafraîchissement initial");
    forceRefresh();
    
    // Ajouter un écouteur d'événements pour la visibilité de la page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Statistics: Page visible, forçage du rafraîchissement");
        forceRefresh();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Rafraîchir régulièrement les données (toutes les 15 secondes)
    const intervalId = setInterval(() => {
      console.log("Statistics: Rafraîchissement périodique");
      forceRefresh();
    }, 15000);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [forceRefresh]);

  const { data: books = [], refetch: refetchBooks, isLoading } = useQuery({
    queryKey: ['books', key],
    queryFn: loadBooks,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
    gcTime: 0,
  });

  console.log('Statistics: Livres chargés:', books.length);
  console.log('Statistics: Statuts des livres:', books.map(book => ({ id: book.id, title: book.title, status: book.status })));

  // Get available years and completed books
  const { availableYears, allCompletedBooks } = useAvailableYears(books, currentYear);
  
  // Log pour vérifier les livres complétés
  console.log("Statistics: Livres complétés:", allCompletedBooks.length);
  allCompletedBooks.forEach((book, index) => {
    console.log(`Livre complété #${index + 1}:`, book.title, "Date de complétion:", book.completionDate);
  });
  
  // Handle year selection with automatic fallback
  const { selectedYear, setSelectedYear } = useYearSelection(allCompletedBooks, currentYear);
  
  // Filter books based on selected year and status
  const { completedBooks, readingBooks, toReadBooks } = useFilteredBooks(
    books, 
    selectedYear, 
    allCompletedBooks
  );
  
  // Log pour vérifier les livres complétés pour l'année sélectionnée
  console.log(`Statistics: Livres complétés pour l'année ${selectedYear}:`, completedBooks.length);
  completedBooks.forEach((book, index) => {
    console.log(`Livre complété pour ${selectedYear} #${index + 1}:`, book.title);
  });

  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="px-3 sm:px-4 lg:px-6 py-6 sm:py-8 flex-grow overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            <button 
              onClick={forceRefresh} 
              className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-md mb-2"
            >
              Rafraîchir les statistiques
            </button>
            
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
