
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface ReadingTimeStatsProps {
  totalReadingTimeHours: string;
  readingSpeed: number;
}

export function ReadingTimeStats({ totalReadingTimeHours, readingSpeed }: ReadingTimeStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Temps de lecture</CardTitle>
        <CardDescription>Estimation du temps passé à lire</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 flex flex-col justify-center h-full">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Temps total estimé
            </p>
            <p className="text-2xl font-bold">{totalReadingTimeHours}</p>
          </div>
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">
          Basé sur une vitesse moyenne de {readingSpeed} pages par heure
        </p>
      </CardContent>
    </Card>
  );
}
