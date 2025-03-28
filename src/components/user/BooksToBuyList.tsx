
import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { getAmazonAffiliateUrl, AMAZON_AFFILIATE_ID } from '@/lib/amazon-utils';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, AlertCircle, Trash2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { deleteBook } from '@/services/supabaseBooks';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from '@tanstack/react-query';

export function BooksToBuyList() {
  const { user } = useSupabaseAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      fetchBooksToBuy();
    }
  }, [user]);

  const fetchBooksToBuy = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('books')
        .select('book_data')
        .eq('user_id', user?.id)
        .eq('status', 'to-read');
      
      if (error) {
        throw error;
      }
      
      // Transformer les données pour extraire les livres à acheter
      const bookList: Book[] = data
        .map(item => {
          // Handle the Json type safely by using a type guard
          if (typeof item.book_data === 'string') {
            return JSON.parse(item.book_data);
          } else {
            // If it's already an object, return it directly
            return item.book_data as Book;
          }
        })
        .filter(book => !book.purchased);
        
      setBooks(bookList);
    } catch (err: any) {
      console.error('Error fetching books to buy:', err);
      setError(`Erreur lors du chargement des livres: ${err.message || 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    
    try {
      setIsDeleting(true);
      
      console.log('Deleting book with ID:', bookToDelete.id);
      await deleteBook(bookToDelete.id);
      
      // Update local state - remove the deleted book from the list
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookToDelete.id));
      
      // Invalidate the books query to refresh any other components using this data
      await queryClient.invalidateQueries({ queryKey: ['books'] });
      
      toast({
        title: "Livre supprimé",
        description: `"${bookToDelete.title}" a été retiré de votre liste d'achats`,
      });
      
      console.log('Book deleted successfully');
    } catch (err: any) {
      console.error('Error deleting book:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de supprimer le livre: ${err.message || 'Erreur inconnue'}`,
      });
    } finally {
      setIsDeleting(false);
      setBookToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-amber-50 dark:bg-amber-900/20 border-b">
        <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <ShoppingCart className="h-5 w-5" />
          Livres à acheter
        </CardTitle>
        <CardDescription>
          Retrouvez tous les livres que vous souhaitez acheter. En utilisant les liens Amazon ci-dessous, 
          vous soutenez le développement de BiblioPulse sans frais supplémentaires pour vous.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-700 dark:text-amber-200 font-medium mb-2">
            <strong>Comment soutenir BiblioPulse :</strong>
          </p>
          <ul className="text-sm text-amber-700 dark:text-amber-200 space-y-2">
            <li>• En cliquant sur les liens Amazon ci-dessous, vous générez une commission d'affiliation (identifiant: {AMAZON_AFFILIATE_ID}) sans aucun coût supplémentaire pour vous.</li>
            <li>• Cette commission s'applique à tout achat effectué dans les 24 heures suivant votre clic, pas uniquement pour le livre concerné.</li>
            <li>• Si vous ajoutez un produit à votre panier sans finaliser l'achat immédiatement, le cookie reste valide pendant 90 jours pour cet article spécifique.</li>
            <li>• Votre soutien via ces liens permet à BiblioPulse de rester à jamais gratuit et de continuer à se développer.</li>
          </ul>
          <p className="text-sm text-amber-700 dark:text-amber-200 mt-2 italic">
            Note: Si vous accédez à Amazon via un autre lien affilié après le nôtre, notre cookie est remplacé et nous ne percevrons pas de commission sur vos achats suivants.
          </p>
        </div>

        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <p className="text-center py-8 text-muted-foreground">Chargement des livres à acheter...</p>
        ) : books.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun livre à acheter pour le moment.</p>
            <p className="text-sm mt-2">Ajoutez des livres à votre bibliothèque et marquez-les comme "non achetés" pour les voir apparaître ici.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {books.map((book) => (
              <div key={book.id} className="flex gap-4 border-b pb-4">
                <div className="relative w-[80px] h-[120px] shrink-0">
                  <img
                    src={book.cover || '/placeholder.svg'}
                    alt={book.title}
                    className="absolute w-full h-full object-cover shadow-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="flex flex-col flex-grow gap-2">
                  <div>
                    <h3 className="font-semibold">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {Array.isArray(book.author) ? book.author.join(', ') : book.author}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    <a 
                      href={getAmazonAffiliateUrl(book)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Acheter sur Amazon
                    </a>
                    
                    <AlertDialog open={isDeleteDialogOpen && bookToDelete?.id === book.id} onOpenChange={setIsDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="px-3 py-1.5"
                          onClick={() => {
                            setBookToDelete(book);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Vous êtes sur le point de supprimer "{book.title}" de votre liste d'achats.
                            Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteBook}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Suppression...
                              </>
                            ) : 'Supprimer'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
