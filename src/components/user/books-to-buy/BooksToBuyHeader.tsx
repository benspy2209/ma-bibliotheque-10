
import { ShoppingCart } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function BooksToBuyHeader() {
  return (
    <CardHeader className="bg-amber-50 dark:bg-amber-900/20 border-b">
      <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
        <ShoppingCart className="h-5 w-5" />
        Livres à acheter
      </CardTitle>
      <CardDescription>
        Retrouvez tous les livres que vous souhaitez acheter. En utilisant les liens Amazon ci-dessous, 
        vous soutenez le développement de BiblioPulse sans frais supplémentaires pour vous.
      </CardDescription>
    </CardHeader>
  );
}
