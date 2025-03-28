
import { Button } from "@/components/ui/button";
import { AddManualBook } from "@/components/AddManualBook";
import { useState } from "react";

interface HeaderSectionProps {
  onBookAdded: () => void;
}

export function HeaderSection({ onBookAdded }: HeaderSectionProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-10">
      <div className="w-full md:w-auto flex flex-col space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Rechercher des livres
        </h1>
        <p className="text-lg text-muted-foreground">
          Trouvez des livres et des bandes dessinées par auteur ou titre
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
        <AddManualBook onBookAdded={onBookAdded} />
      </div>
    </div>
  );
}
