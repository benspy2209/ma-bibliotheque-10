
import { ReadingStreak } from './ReadingStreak';
import { Card } from "@/components/ui/card";

interface ReadingProgressProps {
  booksThisYear: number;
  yearlyGoal: number;
  yearlyProgressPercentage: number;
  booksThisMonth: number;
  monthlyGoal: number;
  monthlyProgressPercentage: number;
}

// Ce composant regroupe tous les éléments liés à la progression de lecture
export function ReadingProgress({
  booksThisYear,
  yearlyGoal,
  yearlyProgressPercentage,
  booksThisMonth,
  monthlyGoal,
  monthlyProgressPercentage
}: ReadingProgressProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <ReadingStreak />
      <Card>
        {/* Contenu existant des objectifs de lecture */}
      </Card>
    </div>
  );
}
