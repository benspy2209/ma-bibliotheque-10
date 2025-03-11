
import { ReadingStatus } from "@/types/book";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookPlus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface AddToLibraryProps {
  onStatusChange: (status: ReadingStatus) => void;
  currentStatus?: ReadingStatus;
}

export function AddToLibrary({ onStatusChange, currentStatus }: AddToLibraryProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (status: ReadingStatus) => {
    setIsLoading(true);
    try {
      onStatusChange(status);
      toast({
        description: "Livre ajouté à votre bibliothèque",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Une erreur est survenue",
      });
    }
    setIsLoading(false);
  };

  const statusLabels: Record<ReadingStatus, string> = {
    'to-read': 'À lire',
    'reading': 'En cours',
    'completed': 'Lu'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          <BookPlus className="mr-2 h-4 w-4" />
          {currentStatus ? statusLabels[currentStatus] : "Ajouter à ma bibliothèque"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(statusLabels).map(([status, label]) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(status as ReadingStatus)}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
