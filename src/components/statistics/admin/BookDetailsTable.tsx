
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UserBookDetail {
  user_email: string;
  user_id: string;
  book_id: string;
  book_title: string;
  book_author: string;
  status: string | null;
  purchased?: boolean;
}

interface BookDetailsTableProps {
  bookDetails: UserBookDetail[];
}

export function BookDetailsTable({ bookDetails }: BookDetailsTableProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Filter Stephen King books for the admin user that need to be updated
  const stephenKingBooks = bookDetails.filter(book => 
    book.user_email === 'debruijneb@gmail.com' && 
    book.book_author.toLowerCase().includes('stephen king') &&
    (!book.purchased || book.status !== 'to-read')  // Only include books that aren't already marked as purchased
  );

  const updateStephenKingBooksStatus = async () => {
    if (stephenKingBooks.length === 0) {
      toast({
        description: "Aucun livre de Stephen King à mettre à jour.",
      });
      return;
    }

    setIsUpdating(true);
    try {
      // Get each book's complete data
      const updatePromises = stephenKingBooks.map(async (bookDetail) => {
        // First, get the complete book data
        const { data: bookData, error: getError } = await supabase
          .from('books')
          .select('book_data')
          .eq('id', bookDetail.book_id)
          .single();

        if (getError) {
          console.error('Erreur lors de la récupération du livre:', getError);
          return { success: false, error: getError };
        }

        // Make sure book_data is a valid object before spreading
        if (!bookData || typeof bookData.book_data !== 'object') {
          console.error('Les données du livre sont invalides:', bookData);
          return { success: false, error: 'Invalid book data' };
        }

        // Update the status to 'to-read' and purchased flag to true
        const updatedBookData = {
          ...bookData.book_data,
          status: 'to-read',
          purchased: true,
          _lastUpdated: new Date().toISOString() // Force update detection
        };

        // Save back to database
        const { error: updateError } = await supabase
          .from('books')
          .update({ 
            status: 'to-read', 
            book_data: updatedBookData 
          })
          .eq('id', bookDetail.book_id);

        if (updateError) {
          console.error('Erreur lors de la mise à jour du livre:', updateError);
          return { success: false, error: updateError };
        }

        return { success: true };
      });

      const results = await Promise.all(updatePromises);
      const successCount = results.filter(r => r.success).length;

      toast({
        description: `${successCount} livres de Stephen King ont été mis à jour avec succès.`,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des livres:', error);
      toast({
        variant: "destructive",
        description: "Une erreur est survenue lors de la mise à jour des livres.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="overflow-auto max-h-[500px]">
      {stephenKingBooks.length > 0 && (
        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
          <p className="text-sm mb-2">
            <strong>{stephenKingBooks.length} livres de Stephen King</strong> dans le compte admin nécessitent une mise à jour.
          </p>
          <Button 
            onClick={updateStephenKingBooksStatus} 
            disabled={isUpdating}
            className="bg-amber-500 hover:bg-amber-600 text-white"
            size="sm"
          >
            {isUpdating ? "Mise à jour en cours..." : "Marquer comme achetés"}
          </Button>
        </div>
      )}

      <Table>
        <TableHeader className="sticky top-0 bg-background">
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Auteur</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookDetails.map((book) => (
            <TableRow key={book.book_id}>
              <TableCell className="font-medium">{book.user_email}</TableCell>
              <TableCell>{book.book_title}</TableCell>
              <TableCell>{book.book_author}</TableCell>
              <TableCell>
                <Badge 
                  variant={
                    book.status === 'completed' ? 'success' : 
                    book.status === 'reading' ? 'default' : 
                    'secondary'
                  }
                >
                  {book.status === 'completed' ? 'Lu' : 
                   book.status === 'reading' ? 'En cours' : 
                   'À lire'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
