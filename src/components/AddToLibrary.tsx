
import { ReadingStatus } from "@/types/book";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookmarkPlus, BookOpen, CheckCircle, X } from 'lucide-react';
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/hooks/use-theme";
import { Badge } from "@/components/ui/badge";

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
  const { theme } = useTheme();

  const handleStatusChange = async (status: ReadingStatus) => {
    setIsLoading(true);
    try {
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

  // Icônes et labels pour chaque statut
  const statusConfig: Record<ReadingStatus, { icon: React.ReactNode, label: string }> = {
    'to-read': { icon: <BookmarkPlus className="h-4 w-4" />, label: 'À lire' },
    'reading': { icon: <BookOpen className="h-4 w-4" />, label: 'En cours' },
    'completed': { icon: <CheckCircle className="h-4 w-4" />, label: 'Lu' }
  };

  // Style du badge selon le thème
  const badgeClass = theme === 'dark' 
    ? "bg-gray-800/80 hover:bg-gray-700/90 text-white"
    : "bg-white/80 hover:bg-gray-100/90 text-gray-800 border border-gray-200";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div 
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer ${badgeClass} backdrop-blur-sm shadow-sm ${isLoading ? 'opacity-50' : ''}`}
        >
          {currentStatus 
            ? statusConfig[currentStatus].icon 
            : <BookmarkPlus className="h-4 w-4" />}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800'}>
        {Object.entries(statusConfig).map(([status, { icon, label }]) => (
          <DropdownMenuItem
            key={status}
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange(status as ReadingStatus);
            }}
            className={`flex items-center gap-2 ${currentStatus === status ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') : ''} ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            {icon}
            {label}
          </DropdownMenuItem>
        ))}
        
        {currentStatus && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              // Ici, on pourrait ajouter une fonction pour retirer le livre de la bibliothèque
              toast({
                description: "La suppression depuis ce menu n'est pas encore implémentée"
              });
            }}
            className={`flex items-center gap-2 text-red-500 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X className="h-4 w-4" />
            Retirer
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
