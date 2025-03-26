
import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface YearFilterProps {
  years: number[];
  selectedYear: number | null;
  onYearSelect: (year: number | null) => void;
}

export function YearFilter({ years, selectedYear, onYearSelect }: YearFilterProps) {
  // Organizez les années en grille
  const yearGrid = useMemo(() => {
    // Triez les années par ordre décroissant
    const sortedYears = [...years].sort((a, b) => b - a);
    
    // Organisez-les en rangées de 4 pour une présentation en grille
    const grid: number[][] = [];
    for (let i = 0; i < sortedYears.length; i += 4) {
      grid.push(sortedYears.slice(i, i + 4));
    }
    return grid;
  }, [years]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1 border-dashed"
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>{selectedYear ? `Année: ${selectedYear}` : "Toutes les années"}</span>
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
                    onClick={() => onYearSelect(year === selectedYear ? null : year)}
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
              className="w-full mt-2" 
              onClick={() => onYearSelect(null)}
            >
              Voir toutes les années
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
