
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewMode } from "@/hooks/use-view-preference";

interface ViewToggleProps {
  viewMode: ViewMode;
  onToggle: () => void;
}

export const ViewToggle = ({ viewMode, onToggle }: ViewToggleProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onToggle}
      className="ml-2"
    >
      {viewMode === 'grid' ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
    </Button>
  );
};
