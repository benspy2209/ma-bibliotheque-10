
import { Book } from '@/types/book';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Book as BookIcon, Calendar, ListTree, Layers, Users } from 'lucide-react';

interface BookDetailsProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export function BookDetails({ book, isOpen, onClose }: BookDetailsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{book.title}</DialogTitle>
          <DialogDescription>
            Détails du livre
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-[200px,1fr] gap-6 py-4">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full rounded-lg shadow-lg"
          />
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Auteur(s)
              </h3>
              <p>{Array.isArray(book.author) ? book.author.join(', ') : book.author}</p>
            </div>

            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date de publication
              </h3>
              <p>{book.publishDate || "Date non disponible"}</p>
            </div>

            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <BookIcon className="h-4 w-4" />
                Nombre de pages
              </h3>
              <p>{book.numberOfPages ? `${book.numberOfPages} pages` : "Information non disponible"}</p>
            </div>

            {book.series && (
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <ListTree className="h-4 w-4" />
                  Série
                </h3>
                <p>{book.series}</p>
              </div>
            )}

            {book.subjects && book.subjects.length > 0 && (
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Catégories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {book.subjects.slice(0, 5).map((subject, index) => (
                    <span
                      key={index}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4" />
        
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          {book.description ? (
            <p className="text-muted-foreground whitespace-pre-line">{book.description}</p>
          ) : (
            <p className="text-muted-foreground italic">Aucune description disponible pour ce livre</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
