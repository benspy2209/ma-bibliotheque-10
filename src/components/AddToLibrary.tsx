
import { ReadingStatus } from "@/types/book";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookmarkPlus, BookOpen, CheckCircle, X, ShoppingBag } from 'lucide-react';
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
  const [status, setStatus] = useState<ReadingStatus | undefined>(currentStatus);
  const queryClient = useQueryClient();
  const { theme } = useTheme();

  // Mise à jour du statut local lorsque currentStatus change
  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const handleStatusChange = async (newStatus: ReadingStatus, purchased: boolean = true) => {
    setIsLoading(true);
    try {
      // Mettre à jour le statut local immédiatement pour l'interface utilisateur
      setStatus(newStatus);
      
      // Appeler la fonction de changement de statut
      await onStatusChange(newStatus);
      
      // For non-purchased books, set the purchased flag
      if (!purchased) {
        // This is handled in the BookCard component where the book's purchased flag is set to false
        console.log("Setting book as not purchased");
      }
      
      // Force une invalidation IMMÉDIATE de toutes les requêtes liées aux livres
      await queryClient.invalidateQueries({ 
        queryKey: ['books'],
        refetchType: 'all',
        exact: false
      });
      
      console.log(`Statut du livre ${bookId} changé à: ${newStatus} - Cache invalidé`);
      
      let toastMessage = "";
      if (newStatus === 'to-read' && !purchased) {
        toastMessage = "Livre ajouté à votre liste d'achats";
      } else if (newStatus === 'to-read') {
        toastMessage = "Livre ajouté à votre liste de lecture";
      } else if (newStatus === 'reading') {
        toastMessage = "Livre ajouté à vos lectures en cours";
      } else {
        toastMessage = "Livre marqué comme lu";
      }
      
      toast({ description: toastMessage });
      
    } catch (error) {
      // En cas d'erreur, rétablir le statut précédent
      setStatus(currentStatus);
      
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

  // Icônes et labels pour chaque statut
  const statusConfig: Record<string, { icon: React.ReactNode, label: string, bgColor: string, textColor: string, action?: () => Promise<void> }> = {
    'to-read': { 
      icon: <BookmarkPlus className="h-4 w-4 text-[#CC4153]" />, 
      label: 'À lire',
      bgColor: theme === 'dark' ? 'bg-blue-500' : 'bg-blue-100', 
      textColor: theme === 'dark' ? 'text-white' : 'text-blue-800' 
    },
    'reading': { 
      icon: <BookOpen className="h-4 w-4 text-[#CC4153]" />, 
      label: 'En cours',
      bgColor: theme === 'dark' ? 'bg-amber-500' : 'bg-amber-100', 
      textColor: theme === 'dark' ? 'text-white' : 'text-amber-800'
    },
    'completed': { 
      icon: <CheckCircle className="h-4 w-4 text-[#CC4153]" />, 
      label: 'Lu',
      bgColor: theme === 'dark' ? 'bg-green-500' : 'bg-green-100', 
      textColor: theme === 'dark' ? 'text-white' : 'text-green-800'
    },
    'to-buy': {
      icon: <ShoppingBag className="h-4 w-4 text-[#CC4153]" />,
      label: 'À acheter',
      bgColor: theme === 'dark' ? 'bg-orange-500' : 'bg-orange-100', 
      textColor: theme === 'dark' ? 'text-white' : 'text-orange-800',
      action: () => handleStatusChange('to-read', false)
    }
  };

  // Style du badge selon le thème et le statut
  const getBadgeClass = () => {
    if (!status) {
      return theme === 'dark' 
        ? 'bg-gray-800/80 hover:bg-gray-700/90 text-white'
        : 'bg-white/80 hover:bg-gray-100/90 text-gray-800 border border-gray-200';
    }
    
    return `${statusConfig[status].bgColor} ${statusConfig[status].textColor}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div 
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold cursor-pointer backdrop-blur-sm shadow-sm ${getBadgeClass()} ${isLoading ? 'opacity-50' : ''}`}
        >
          {status 
            ? statusConfig[status].icon 
            : <BookmarkPlus className="h-5 w-5 mr-1" />}
          {!status && <span className="ml-1">Ajouter</span>}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800'}>
        {/* Standard reading status options - moved to-buy to the end */}
        {Object.entries(statusConfig)
          .filter(([key]) => key !== 'to-buy')
          .map(([statusKey, { icon, label }]) => (
          <DropdownMenuItem
            key={statusKey}
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange(statusKey as ReadingStatus);
            }}
            className={`flex items-center gap-2 ${status === statusKey ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') : ''} ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            {icon}
            {label}
          </DropdownMenuItem>
        ))}
        
        {/* À acheter option at the end */}
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            statusConfig['to-buy'].action?.();
          }}
          className={`flex items-center gap-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          {statusConfig['to-buy'].icon}
          {statusConfig['to-buy'].label}
        </DropdownMenuItem>
        
        {status && (
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
