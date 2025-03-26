
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookOpen, TrendingUp, Clock } from "lucide-react";

interface AverageStatsProps {
  avgPagesPerBook: number;
  readingSpeed: string;
  avgReadingTime: string;
}

export function AverageStats({ avgPagesPerBook, readingSpeed, avgReadingTime }: AverageStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Moyenne par livre</CardTitle>
        <CardDescription>Statistiques moyennes par livre</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Pages par livre
            </p>
            <p className="text-2xl font-bold">{avgPagesPerBook}</p>
          </div>
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Vitesse de lecture
            </p>
            <p className="text-2xl font-bold">{readingSpeed} <span className="text-sm font-normal">pages/jour</span></p>
          </div>
          <TrendingUp className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">Pages par jour en moyenne</p>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Un livre est lu en moyenne en
            </p>
            <p className="text-2xl font-bold">{avgReadingTime} jours</p>
          </div>
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
