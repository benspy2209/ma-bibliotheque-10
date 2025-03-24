
import { ReadingStatus } from "@/types/book";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface AddToLibraryProps {
  onStatusChange: (status: ReadingStatus) => void;
  currentStatus?: ReadingStatus;
  bookId: string;
  bookTitle: string;
  bookAuthor: string | string[];
}

export function AddToLibrary({ 
  onStatusChange, 
  currentStatus, 
  bookId, 
  bookTitle, 
  bookAuthor 
}: AddToLibraryProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleStatusChange = async (status: ReadingStatus) => {
    setIsLoading(true);
    try {
      // La vérification des doublons est maintenant gérée directement dans saveBook
      // Pas besoin de l'implémenter ici
      await onStatusChange(status);
      
      // Force une invalidation IMMÉDIATE de toutes les requêtes liées aux livres
      await queryClient.invalidateQueries({ 
        queryKey: ['books'],
        refetchType: 'all',
        exact: false
      });
      
      console.log(`Statut du livre ${bookId} changé à: ${status} - Cache invalidé`);
      
      toast({
        description: status === 'to-read' 
          ? "Livre ajouté à votre liste de lecture" 
          : status === 'reading' 
          ? "Livre ajouté à vos lectures en cours" 
          : "Livre marqué comme lu",
      });
      
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error 
          ? error.message 
          : "Une erreur est survenue lors de l'ajout du livre",
      });
      console.error("Erreur lors de l'ajout du livre:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Force une actualisation lorsque le statut actuel change
    if (currentStatus) {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  }, [currentStatus, queryClient]);

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
          className="bg-primary text-white hover:bg-primary/90 flex items-center gap-1"
        >
          <BookPlus className="h-3 w-3" />
          Ajouter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(statusLabels).map(([status, label]) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(status as ReadingStatus)}
            className={currentStatus === status ? "bg-muted" : ""}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
