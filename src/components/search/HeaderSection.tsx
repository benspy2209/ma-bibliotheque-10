
import { useState } from 'react';
import { AddManualBook } from '@/components/add-book/AddManualBook';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HeaderSectionProps {
  onBookAdded: () => void;
}

export const HeaderSection = ({ onBookAdded }: HeaderSectionProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="mb-8 text-center flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">Recherche de Livres</h1>
      <div className="flex items-center gap-2">
        <p className="text-muted-foreground mb-4">
          Trouvez des livres en français à ajouter à votre bibliothèque
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-left">
              <p className="font-semibold mb-1">Conseils de recherche:</p>
              <ul className="list-disc pl-4 text-sm space-y-1">
                <li>Recherchez par titre de livre</li>
                <li>Recherchez par nom d'auteur</li>
                <li>Recherchez par ISBN (10 ou 13 chiffres)</li>
                <li>Les résultats sont limités aux livres en français</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <AddManualBook 
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        onBookAdded={onBookAdded}
      />
    </div>
  );
};
