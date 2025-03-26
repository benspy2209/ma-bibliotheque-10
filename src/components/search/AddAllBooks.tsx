
import { Button } from "@/components/ui/button";
import { Book, ReadingStatus } from "@/types/book";
import { useToast } from "@/hooks/use-toast";
import { saveBook } from "@/services/supabaseBooks";
import { useState } from "react";
import { BookPlus, Loader2 } from "lucide-react";

interface AddAllBooksProps {
  books: Book[];
  onComplete: () => void;
}

export function AddAllBooks({ books, onComplete }: AddAllBooksProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddAllBooks = async () => {
    if (books.length === 0) {
      toast({
        description: "Aucun livre à ajouter",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Nombre de livres ajoutés avec succès
      let successCount = 0;
      // Nombre de livres déjà présents dans la bibliothèque
      let duplicateCount = 0;
      
      // Statut à appliquer à tous les livres
      const status: ReadingStatus = "to-read";
      
      // Traiter chaque livre
      for (const book of books) {
        // Préparer le livre avec le statut "à lire"
        const bookToSave = {
          ...book,
          status
        };
        
        // Sauvegarder le livre
        const result = await saveBook(bookToSave);
        
        if (result.success) {
          successCount++;
        } else if (result.error === 'duplicate') {
          duplicateCount++;
        }
      }
      
      // Notifier l'utilisateur du résultat
      if (successCount > 0) {
        toast({
          description: `${successCount} livre(s) ajouté(s) à votre liste "à lire"${
            duplicateCount > 0 ? ` (${duplicateCount} déjà présent(s))` : ""
          }`,
        });
      } else if (duplicateCount > 0) {
        toast({
          description: `Tous les livres (${duplicateCount}) sont déjà dans votre bibliothèque`,
          variant: "destructive",
        });
      }
      
      // Appeler la fonction de mise à jour
      onComplete();
    } catch (error) {
      console.error("Erreur lors de l'ajout de tous les livres", error);
      toast({
        description: "Une erreur est survenue lors de l'ajout des livres",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddAllBooks}
      disabled={isLoading || books.length === 0}
      variant="default"
      className="ml-2 flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <BookPlus className="h-4 w-4" />
      )}
      Ajouter tous les livres ({books.length})
    </Button>
  );
}
