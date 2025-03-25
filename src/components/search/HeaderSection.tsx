
import { Button } from "@/components/ui/button";
import { AddManualBook } from "@/components/AddManualBook";
import { useState } from "react";
import { useUpdateAmazonLinks } from "@/services/updateExistingBooks";
import { RefreshCw } from "lucide-react";

interface HeaderSectionProps {
  onBookAdded: () => void;
}

export function HeaderSection({ onBookAdded }: HeaderSectionProps) {
  const { updateLinks } = useUpdateAmazonLinks();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateAmazonLinks = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await updateLinks();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <div className="w-full md:w-auto flex flex-col space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Rechercher des livres
        </h1>
        <p className="text-muted-foreground">
          Trouvez des livres par auteur ou titre
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={handleUpdateAmazonLinks}
          disabled={isUpdating}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
          Mettre à jour liens Amazon
        </Button>
        
        <AddManualBook onBookAdded={onBookAdded} />
      </div>
    </div>
  );
}
