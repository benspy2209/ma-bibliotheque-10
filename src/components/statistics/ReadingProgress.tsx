
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
        {/* Contenu des objectifs de lecture */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Objectif annuel</p>
              <p className="text-sm font-medium">
                {booksThisYear} / {yearlyGoal} livres
              </p>
            </div>
            <Progress value={yearlyProgressPercentage} />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Objectif mensuel</p>
              <p className="text-sm font-medium">
                {booksThisMonth} / {monthlyGoal} livres
              </p>
            </div>
            <Progress value={monthlyProgressPercentage} />
          </div>
        </div>
      </Card>
    </div>
  );
}

// Importation du composant Progress nécessaire
import { Progress } from "@/components/ui/progress";
