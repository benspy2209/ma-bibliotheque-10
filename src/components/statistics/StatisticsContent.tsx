
import { Book } from "@/types/book";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCalculator } from "@/components/statistics/StatsCalculator";
import { StatsOverview } from "@/components/statistics/StatsOverview";
import { MonthlyStats } from "@/components/statistics/MonthlyStats";
import { AverageStats } from "@/components/statistics/AverageStats";
import { ReadingTimeStats } from "@/components/statistics/ReadingTimeStats";
import { GoalsAndStreak } from "@/components/statistics/GoalsAndStreak";
import { AuthorsGenresStats } from "@/components/statistics/AuthorsGenresStats";
import { ReadingTimeDistribution } from "@/components/statistics/ReadingTimeDistribution";
import { YearlyBooksList } from "@/components/statistics/YearlyBooksList";
import { useIsMobile } from "@/hooks/use-mobile";

interface StatisticsContentProps {
  completedBooks: Book[];
  readingBooks: Book[];
  toReadBooks: Book[];
  selectedYear: number | null;
  allCompletedBooks: Book[];
  purchasedBooks: number;
  toBuyBooks: number;
}

export function StatisticsContent({
  completedBooks,
  readingBooks,
  toReadBooks,
  selectedYear,
  allCompletedBooks,
  purchasedBooks,
  toBuyBooks
}: StatisticsContentProps) {
  const isMobile = useIsMobile();

  return (
    <div className="overflow-hidden">
      <StatsCalculator
        completedBooks={completedBooks}
        readingBooks={readingBooks}
        toReadBooks={toReadBooks}
        selectedYear={selectedYear}
        purchasedBooks={purchasedBooks}
        toBuyBooks={toBuyBooks}
      >
        {(stats) => (
          <>
            <StatsOverview
              totalBooks={stats.totalBooks}
              totalPages={stats.totalPages}
              totalReadingDays={stats.totalReadingDays}
              readingBooks={stats.readingBooks}
              toReadBooks={stats.toReadBooks}
              purchasedBooks={stats.purchasedBooks}
              toBuyBooks={stats.toBuyBooks}
            />

            <Tabs defaultValue="overview" className="w-full">
              <div className="overflow-x-auto pb-1">
                <TabsList className={`mb-4 ${isMobile ? 'flex-wrap h-auto py-2 w-max min-w-full' : ''}`}>
                  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="monthly">Données mensuelles</TabsTrigger>
                  <TabsTrigger value="authors">Auteurs & Genres</TabsTrigger>
                  <TabsTrigger value="reading-time">Temps de lecture</TabsTrigger>
                </TabsList>
              </div>

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
  );
}
