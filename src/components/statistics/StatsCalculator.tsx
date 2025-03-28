
import { StatsCalculatorProps } from '@/types/statistics';
import { useCalculatedStats } from '@/hooks/use-calculated-stats';

export function StatsCalculator({ 
  completedBooks, 
  readingBooks, 
  toReadBooks,
  selectedYear,
  children 
}: StatsCalculatorProps) {
  const stats = useCalculatedStats(completedBooks, readingBooks, toReadBooks, selectedYear);
  return <>{children(stats)}</>;
}

export { type CalculatedStats } from '@/types/statistics';
