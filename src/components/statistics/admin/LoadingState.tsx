
import { CardContent } from "@/components/ui/card";

export function LoadingState() {
  return (
    <CardContent className="pt-6">
      <div className="flex justify-center items-center h-40">
        <p className="text-muted-foreground">Chargement des statistiques...</p>
      </div>
    </CardContent>
  );
}
