
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ReadingStreak } from './ReadingStreak';
import { ReadingGoalsForm } from './ReadingGoalsForm';

interface GoalsAndStreakProps {
  yearlyGoal: number;
  monthlyGoal: number;
  booksThisYear: number;
  booksThisMonth: number;
  yearlyProgressPercentage: number;
  monthlyProgressPercentage: number;
}

export function GoalsAndStreak({
  yearlyGoal,
  monthlyGoal,
  booksThisYear,
  booksThisMonth,
  yearlyProgressPercentage,
  monthlyProgressPercentage
}: GoalsAndStreakProps) {
  return (
    <div className="space-y-4">
      <ReadingStreak />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-lg">Objectifs de lecture</CardTitle>
            <CardDescription>Progression vers vos objectifs</CardDescription>
          </div>
          <ReadingGoalsForm 
            yearlyGoal={yearlyGoal}
            monthlyGoal={monthlyGoal}
          />
        </CardHeader>
        <CardContent className="space-y-6">
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
        </CardContent>
      </Card>
    </div>
  );
}
