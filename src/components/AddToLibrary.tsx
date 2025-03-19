
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
import { loadBooks } from "@/services/supabaseBooks";
import { removeDuplicateBooks } from "@/lib/utils";

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

  const handleStatusChange = async (status: ReadingStatus) => {
    setIsLoading(true);
    try {
      // Vérification si le livre existe déjà dans la bibliothèque
      const existingBooks = await loadBooks();
      
      // Création d'une clé unique pour ce livre
      const bookKey = `${bookTitle.toLowerCase()}_${Array.isArray(bookAuthor) ? bookAuthor[0].toLowerCase() : bookAuthor.toLowerCase()}`;
      
      // Vérification des doublons
      const isDuplicate = existingBooks.some(book => {
        const existingKey = `${book.title.toLowerCase()}_${Array.isArray(book.author) ? book.author[0].toLowerCase() : book.author.toLowerCase()}`;
        return existingKey === bookKey && book.id !== bookId;
      });

      if (isDuplicate) {
        toast({
          variant: "destructive",
          description: "Ce livre est déjà dans votre bibliothèque.",
        });
      } else {
        onStatusChange(status);
        toast({
          description: "Livre ajouté à votre bibliothèque",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Une erreur est survenue",
      });
      console.error("Erreur lors de l'ajout du livre:", error);
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
