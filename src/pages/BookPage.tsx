
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { BookDetails } from '@/components/BookDetails';
import { getBookById } from '@/services/supabaseBooks';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { getAmazonAffiliateUrl } from '@/lib/utils';

const BookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadBook = async () => {
      if (!id) return;
      
      try {
        const bookData = await getBookById(id);
        if (bookData) {
          setBook(bookData);
        } else {
          toast({
            variant: "destructive",
            description: "Le livre n'a pas été trouvé",
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement du livre:', error);
        toast({
          variant: "destructive",
          description: "Erreur lors du chargement du livre",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBook();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Livre non trouvé</p>
      </div>
    );
  }

  return (
    <>
      <Helmet prioritizeSeoTags={true}>
        <title>{`${book.title} - Ma Bibliothèque`}</title>
        <meta property="og:site_name" content="Ma Bibliothèque" />
        <meta property="og:type" content="book" />
        <meta property="og:title" content={`${book.title} - Ma Bibliothèque`} />
        <meta property="og:description" content={book.review?.content || `Découvrez "${book.title}" sur Ma Bibliothèque`} />
        <meta property="og:image" content={book.cover} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="900" />
        <meta property="og:url" content={`https://meslectures.lalibreplume.be/book/${book.id}`} />
      </Helmet>
      <div className="container mx-auto py-8">
        {/* Bouton Acheter sur Amazon ajouté au-dessus des détails */}
        <div className="mb-6 flex justify-end">
          <a 
            href={getAmazonAffiliateUrl(book)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Acheter sur Amazon
            </Button>
          </a>
        </div>
        
        <BookDetails
          book={book}
          isOpen={true}
          onClose={() => {}}
          onUpdate={() => {}}
        />
      </div>
    </>
  );
};

export default BookPage;
