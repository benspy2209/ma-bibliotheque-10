
import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { getAmazonAffiliateUrl, AMAZON_AFFILIATE_ID } from '@/lib/amazon-utils';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function BooksToBuyList() {
  const { user } = useSupabaseAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                  <div className="mt-auto">
                    <a 
                      href={getAmazonAffiliateUrl(book)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Acheter sur Amazon
                    </a>
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
