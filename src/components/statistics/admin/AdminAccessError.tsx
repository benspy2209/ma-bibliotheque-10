
import { AlertCircle } from "lucide-react";
import { CardContent } from "@/components/ui/card";

export function AdminAccessError() {
  return (
    <CardContent className="pt-6">
      <div className="flex flex-col items-center justify-center h-40 space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground text-center">
          Accès restreint. Vous devez être administrateur pour voir ces statistiques.
        </p>
      </div>
    </CardContent>
  );
}
