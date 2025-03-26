
import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, FilterIcon, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface YearFilterProps {
  years: number[];
  selectedYear: number | null;
  onYearSelect: (year: number | null) => void;
  defaultOpen?: boolean;
}

export function YearFilter({ years, selectedYear, onYearSelect, defaultOpen = false }: YearFilterProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Organize years in grid
  const yearGrid = useMemo(() => {
    // Sort years in descending order
    const sortedYears = [...years].sort((a, b) => b - a);
    
    // Organize them in rows of 4 for a grid presentation
    const grid: number[][] = [];
    for (let i = 0; i < sortedYears.length; i += 4) {
      grid.push(sortedYears.slice(i, i + 4));
    }
    return grid;
  }, [years]);

  return (
    <div className="flex items-center space-x-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 gap-1 border-dashed flex items-center font-medium"
          >
            <FilterIcon className="h-4 w-4 mr-1" />
            <span>{selectedYear ? `Année: ${selectedYear}` : "Filtrer par année"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-2">
            <div className="font-medium">Filtrer par année</div>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {yearGrid.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="contents">
                  {row.map((year) => (
                    <Button
                      key={year}
                      variant={year === selectedYear ? "default" : "outline"}
                      className={cn(
                        "h-8 w-16",
                        year === selectedYear ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      )}
                      onClick={() => {
                        onYearSelect(year === selectedYear ? null : year);
                        setIsOpen(false);
                      }}
                    >
                      {year}
                    </Button>
                  ))}
                </div>
              ))}
            </div>
            {selectedYear && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2 flex items-center justify-center" 
                onClick={() => {
                  onYearSelect(null);
                  setIsOpen(false);
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Voir toutes les années
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
      
      {selectedYear && (
        <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20 text-primary">
          {selectedYear}
        </Badge>
      )}
    </div>
  );
}
