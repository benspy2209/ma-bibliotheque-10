import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { useReadingSpeed } from '@/hooks/use-reading-speed';
import { ReadingSpeedSetting } from '@/components/statistics/ReadingSpeedSetting';
import { useQuery } from '@tanstack/react-query';
import { loadBooks } from '@/services/supabaseBooks';
import { getYear } from 'date-fns';
import NavBar from '@/components/NavBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { YearFilter } from "@/components/statistics/YearFilter";
import { YearlyBooksList } from "@/components/statistics/YearlyBooksList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, X } from 'lucide-react';

import { StatsCalculator } from '@/components/statistics/StatsCalculator';
import { StatsOverview } from '@/components/statistics/StatsOverview';
import { MonthlyStats } from '@/components/statistics/MonthlyStats';
import { AverageStats } from '@/components/statistics/AverageStats';
import { ReadingTimeStats } from '@/components/statistics/ReadingTimeStats';
import { GoalsAndStreak } from '@/components/statistics/GoalsAndStreak';
import { AuthorsGenresStats } from '@/components/statistics/AuthorsGenresStats';
import { ReadingTimeDistribution } from '@/components/statistics/ReadingTimeDistribution';
import { AdminUsersStats } from '@/components/statistics/AdminUsersStats';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

export default function Statistics() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number | null>(currentYear);

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

  const allCompletedBooks = books.filter((book): book is Book => 
    book !== null && book.status === 'completed'
  );
  
  const completedBooks = selectedYear
    ? allCompletedBooks.filter(book => {
        if (!book.completionDate) return false;
        const completionYear = getYear(new Date(book.completionDate));
        return completionYear === selectedYear;
      })
    : allCompletedBooks;
  
  console.log('Completed books:', completedBooks.length, 'books');
  
  const readingBooks = books.filter((book): book is Book =>
    book !== null && book.status === 'reading'
  );

  const toReadBooks = books.filter((book): book is Book =>
    book !== null && (!book.status || book.status === 'to-read')
  );

  const availableYears = (() => {
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
    
    for (let year = Math.max(1977, Math.min(...Array.from(years))); year <= currentYear; year++) {
      years.add(year);
    }
    
    return Array.from(years).sort((a, b) => b - a);
  })();

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

  const { user } = useSupabaseAuth();
  const isAdmin = user?.email === 'debruijneb@gmail.com';

  return (
    <>
      <div className="min-h-screen">
        <NavBar />
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Statistiques de lecture</h1>
                <p className="text-muted-foreground">
                  Analyse de vos habitudes de lecture
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <YearFilter
                  years={availableYears}
                  selectedYear={selectedYear}
                  onYearSelect={setSelectedYear}
                />
                <ReadingSpeedSetting />
              </div>
            </div>
            
            {selectedYear && (
              <div className="bg-muted/30 border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-medium">Filtré par année: {selectedYear}</span>
                  <Badge className="ml-2 bg-primary text-primary-foreground">{completedBooks.length} livres</Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedYear(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Effacer le filtre
                </Button>
              </div>
            )}

            {isAdmin && (
              <AdminUsersStats />
            )}

            <StatsCalculator
              completedBooks={completedBooks}
              readingBooks={readingBooks}
              toReadBooks={toReadBooks}
              selectedYear={selectedYear}
            >
              {(stats) => (
                <>
                  <StatsOverview
                    totalBooks={stats.totalBooks}
                    totalPages={stats.totalPages}
                    totalReadingDays={stats.totalReadingDays}
                    readingBooks={stats.readingBooks}
                    toReadBooks={stats.toReadBooks}
                  />

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                      <TabsTrigger value="monthly">Données mensuelles</TabsTrigger>
                      <TabsTrigger value="authors">Auteurs & Genres</TabsTrigger>
                      <TabsTrigger value="reading-time">Temps de lecture</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <AverageStats
                          avgPagesPerBook={stats.avgPagesPerBook}
                          readingSpeed={stats.readingSpeed}
                          avgReadingTime={stats.avgReadingTime}
                        />
                        
                        <GoalsAndStreak
                          yearlyGoal={stats.yearlyGoal}
                          monthlyGoal={stats.monthlyGoal}
                          booksThisYear={stats.booksThisYear}
                          booksThisMonth={stats.booksThisMonth}
                          yearlyProgressPercentage={stats.yearlyProgressPercentage}
                          monthlyProgressPercentage={stats.monthlyProgressPercentage}
                        />
                        
                        <ReadingTimeStats
                          totalReadingTimeHours={stats.totalReadingTimeHours}
                          readingSpeed={stats.userReadingSpeed}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="monthly" className="space-y-6">
                      <MonthlyStats monthlyData={stats.monthlyData} />
                    </TabsContent>

                    <TabsContent value="authors" className="space-y-4">
                      <AuthorsGenresStats
                        topAuthors={stats.topAuthors}
                        topGenres={stats.topGenres}
                      />
                    </TabsContent>

                    <TabsContent value="reading-time" className="space-y-4">
                      <ReadingTimeDistribution
                        readingTimeDistribution={stats.readingTimeDistribution}
                        hasReadingTimeData={stats.hasReadingTimeData}
                        completedBooks={completedBooks}
                      />
                    </TabsContent>
                  </Tabs>
                  
                  {selectedYear && (
                    <div className="mt-8">
                      <YearlyBooksList 
                        books={allCompletedBooks} 
                        selectedYear={selectedYear} 
                      />
                    </div>
                  )}
                </>
              )}
            </StatsCalculator>
          </div>
        </div>
      </div>
    </>
  );
}
