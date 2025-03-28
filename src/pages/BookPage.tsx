
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
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

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
        <title>{`${book.title} - BiblioPulse`}</title>
        <meta property="og:site_name" content="BiblioPulse" />
        <meta property="og:type" content="book" />
        <meta property="og:title" content={`${book.title} - BiblioPulse`} />
        <meta property="og:description" content={book.review?.content || `Découvrez "${book.title}" sur BiblioPulse`} />
        <meta property="og:image" content={book.cover} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="900" />
        <meta property="og:url" content={`https://bibliopulse.be/book/${book.id}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Helmet>
      <NavBar />
      <div className="container mx-auto px-3 md:px-8 py-4 md:py-8">
        {/* Bouton Acheter sur Amazon ajouté au-dessus des détails */}
        <div className="mb-4 md:mb-6 flex justify-end">
          <a 
            href={getAmazonAffiliateUrl(book)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-amber-500 hover:bg-amber-600 text-white text-xs md:text-sm">
              <ShoppingCart className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
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
      <Footer />
    </>
  );
};

export default BookPage;
