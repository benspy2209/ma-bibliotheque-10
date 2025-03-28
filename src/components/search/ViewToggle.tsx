
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewMode } from "@/hooks/use-view-preference";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface ViewToggleProps {
  viewMode: ViewMode;
  onToggle: () => void;
}

export const ViewToggle = ({ viewMode, onToggle }: ViewToggleProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={onToggle}
            className="ml-2"
          >
            {viewMode === 'grid' ? 
              <List className="h-4 w-4" /> : 
              <LayoutGrid className="h-4 w-4" />
            }
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{viewMode === 'grid' ? 'Afficher en liste' : 'Afficher en grille'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
