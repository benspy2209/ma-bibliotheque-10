
import { useNavigate } from 'react-router-dom';
import { Book, ReadingStatus } from '@/types/book';
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, ShoppingCart } from 'lucide-react';
import { getAmazonAffiliateUrl } from '@/lib/utils';
import { AddToLibrary } from '@/components/AddToLibrary';
import { Badge } from '@/components/ui/badge';
import { saveBook } from '@/services/supabaseBooks';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface BookCardProps {
  book: Book;
  onBookClick?: (book: Book) => void;
}

export const BookCard = ({ book, onBookClick }: BookCardProps) => {
  const navigate = useNavigate();
  const amazonUrl = getAmazonAffiliateUrl(book);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Déterminer si c'est un livre audio
  const isAudioBook = (book.format?.toLowerCase().includes('audio') || 
                      book.title.toLowerCase().includes('audio cd') || 
                      book.title.toLowerCase().includes('livre audio'));
  
  // Traiter le titre pour éviter les titres trop longs
  const displayTitle = book.title.length > 60 
    ? book.title.substring(0, 57) + '...' 
    : book.title;
  
  // Gestion du clic sur le livre
  const handleClick = () => {
    if (onBookClick) {
      onBookClick(book);
    }
  };
  
  // Déterminer l'auteur à afficher
  const displayAuthor = Array.isArray(book.author) 
    ? book.author[0] || 'Auteur inconnu' 
    : book.author || 'Auteur inconnu';

  const handleAmazonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche le déclenchement du clic sur la carte
    window.open(amazonUrl, '_blank', 'noopener,noreferrer');
  };

  const handleStatusChange = async (status: ReadingStatus) => {
    try {
      console.log("Changing book status to:", status);
      
      // Créer une copie du livre avec le nouveau statut
      const bookToSave: Book = {
        ...book,
        status
      };
      
      console.log("Saving book with ID:", bookToSave.id);
      const result = await saveBook(bookToSave);
      
      if (result.success) {
        // Forcer une invalidation du cache pour mettre à jour l'interface
        await queryClient.invalidateQueries({ 
          queryKey: ['books'],
          refetchType: 'all',
          exact: false 
        });
        
        // Forcer une actualisation des données
        await queryClient.refetchQueries({ 
          queryKey: ['books'],
          exact: false 
        });
        
        console.log("Book saved successfully, cache invalidated");
      } else {
        console.error("Error saving book:", result.message);
        if (result.error !== 'duplicate') {
          toast({
            variant: "destructive",
            description: result.message || "Une erreur est survenue lors de l'ajout du livre",
          });
        }
      }
    } catch (error) {
      console.error("Error in handleStatusChange:", error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
    }
  };

  return (
    <Card 
      className="h-full flex flex-col relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer transform hover:scale-[1.01] transition-transform"
      onClick={handleClick}
    >
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="relative w-full pt-[140%] bg-gray-100">
          {book.cover ? (
            <img 
              src={book.cover} 
              alt={`Couverture: ${book.title}`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
              <Bookmark className="h-12 w-12 text-muted-foreground/40" />
              <span className="text-xs text-center text-muted-foreground mt-2 px-2">
                Pas de couverture trouvée. Vous pourrez ajouter la vôtre !
              </span>
            </div>
          )}
          
          {isAudioBook && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500 text-white text-xs rounded-md font-medium">
              Audio
            </div>
          )}

          {/* Badge d'actions en haut à gauche */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {/* Badge Amazon */}
            <Badge 
              onClick={handleAmazonClick}
              className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1"
            >
              <ShoppingCart size={12} />
              <span className="text-xs">Amazon</span>
            </Badge>
            
            {/* Badge Ajouter à la bibliothèque */}
            <div onClick={(e) => e.stopPropagation()} className="z-10">
              <AddToLibrary 
                onStatusChange={handleStatusChange}
                bookId={book.id}
                bookTitle={book.title}
                bookAuthor={book.author}
                currentStatus={book.status}
              />
            </div>
          </div>
        </div>
        
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="font-medium text-base mb-1 line-clamp-2" title={book.title}>
            {displayTitle}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {displayAuthor}
          </p>
          
          <div className="mt-auto flex flex-wrap gap-1">
            {book.language && book.language[0] && (
              <span className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                {book.language[0] === 'fr' ? 'Français' : 
                 book.language[0] === 'en' ? 'Anglais' : book.language[0]}
              </span>
            )}
            
            {book.numberOfPages > 0 && (
              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                {book.numberOfPages} p.
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
