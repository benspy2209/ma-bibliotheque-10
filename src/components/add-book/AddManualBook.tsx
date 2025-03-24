
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Book } from "@/types/book";
import { saveBook } from "@/services/supabaseBooks";
import { useToast } from "@/hooks/use-toast";
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { BookForm } from './BookForm';
import { BookFormValues } from './schema';

interface AddManualBookProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onBookAdded: () => void;
}

export function AddManualBook({ isOpen, setIsOpen, onBookAdded }: AddManualBookProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: BookFormValues, coverImage: string | null) => {
    setIsLoading(true);
    try {
      const newBook: Book = {
        id: uuidv4(),
        title: data.title,
        author: data.author,
        language: [data.language],
        description: data.description,
        numberOfPages: data.numberOfPages,
        publishDate: data.publishDate,
        isbn: data.isbn,
        status: 'to-read',
        cover: coverImage || undefined,
      };

      await saveBook(newBook);
      toast({
        description: "Livre ajouté avec succès à votre bibliothèque",
      });
      setIsOpen(false);
      onBookAdded();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du livre:', error);
      toast({
        variant: "destructive",
        description: "Une erreur s'est produite lors de l'ajout du livre",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Ajouter un livre manuellement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un livre manuellement</DialogTitle>
        </DialogHeader>
        <BookForm onSubmit={handleSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}
