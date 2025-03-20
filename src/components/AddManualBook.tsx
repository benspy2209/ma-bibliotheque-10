
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Book } from "@/types/book";
import { saveBook } from "@/services/supabaseBooks";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const bookSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  author: z.string().min(1, "L'auteur est requis"),
  language: z.string().default("fr"),
  description: z.string().optional(),
  numberOfPages: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  publishDate: z.string().optional(),
  isbn: z.string().optional(),
});

type BookFormValues = z.infer<typeof bookSchema>;

interface AddManualBookProps {
  onBookAdded: () => void;
}

export function AddManualBook({ onBookAdded }: AddManualBookProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      language: "fr",
      description: "",
      numberOfPages: "",
      publishDate: "",
      isbn: "",
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: BookFormValues) => {
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
      form.reset();
      setCoverImage(null);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre*</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre du livre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auteur*</FormLabel>
                  <FormControl>
                    <Input placeholder="Auteur du livre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel>Couverture</FormLabel>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="max-w-[300px]"
                />
                {coverImage && (
                  <div className="w-32 h-44 overflow-hidden rounded border">
                    <img src={coverImage} alt="Couverture" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description du livre" {...field} className="min-h-24" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numberOfPages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de pages</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publishDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de publication</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN</FormLabel>
                    <FormControl>
                      <Input placeholder="ISBN du livre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Langue</FormLabel>
                    <FormControl>
                      <Input placeholder="fr" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Ajout en cours..." : "Ajouter le livre"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
