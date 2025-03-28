
import { YearFilter } from "@/components/statistics/YearFilter";
import { ReadingSpeedSetting } from "@/components/statistics/ReadingSpeedSetting";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";
import { Book } from "@/types/book";

interface StatisticsHeaderProps {
  selectedYear: number | null;
  availableYears: number[];
  completedBooks: Book[];
  onYearSelect: (year: number | null) => void;
}

export function StatisticsHeader({
  selectedYear,
  availableYears,
  completedBooks,
  onYearSelect
}: StatisticsHeaderProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Statistiques de lecture</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Analyse de vos habitudes de lecture
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <YearFilter
            years={availableYears}
            selectedYear={selectedYear}
            onYearSelect={onYearSelect}
          />
          <ReadingSpeedSetting />
        </div>
      </div>
      
      {selectedYear && (
        <div className="bg-muted/30 border rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
            <span className="text-sm sm:text-base font-medium">Filtré par année: {selectedYear}</span>
            <Badge className="ml-2 bg-primary text-primary-foreground text-xs">{completedBooks.length} livres</Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onYearSelect(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="text-xs sm:text-sm">Effacer le filtre</span>
          </Button>
        </div>
      )}
    </>
  );
}
