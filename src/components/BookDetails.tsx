
import { Book, ReadingStatus } from '@/types/book';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Book as BookIcon, Calendar, ListTree, Layers, Users, PenLine } from 'lucide-react';
import { AddToLibrary } from './AddToLibrary';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface BookDetailsProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export function BookDetails({ book, isOpen, onClose }: BookDetailsProps) {
  const [currentBook, setCurrentBook] = useState(book);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = (status: ReadingStatus) => {
    const updatedBook = { ...currentBook, status };
    setCurrentBook(updatedBook);
    saveToLibrary(updatedBook);
  };

  const handleInputChange = (field: keyof Book, value: string) => {
    setCurrentBook(prev => ({ ...prev, [field]: value }));
  };

  const saveToLibrary = (bookToSave: Book) => {
    const library = JSON.parse(localStorage.getItem('library') || '{}');
    library[bookToSave.id] = bookToSave;
    localStorage.setItem('library', JSON.stringify(library));
    toast({
      description: "Les modifications ont été enregistrées",
    });
  };

  const handleSave = () => {
    saveToLibrary(currentBook);
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">{currentBook.title}</DialogTitle>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              <PenLine className="h-4 w-4 mr-2" />
              {isEditing ? "Annuler" : "Éditer"}
            </Button>
          </div>
          <DialogDescription className="flex justify-between items-center">
            <span>Détails du livre</span>
            <AddToLibrary 
              onStatusChange={handleStatusChange}
              currentStatus={currentBook.status}
            />
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-[200px,1fr] gap-6 py-4">
          <img
            src={currentBook.cover}
            alt={currentBook.title}
            className="w-full rounded-lg shadow-lg"
          />
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Auteur(s)
              </h3>
              {isEditing ? (
                <Input
                  value={Array.isArray(currentBook.author) ? currentBook.author.join(', ') : currentBook.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                />
              ) : (
                <p>{Array.isArray(currentBook.author) ? currentBook.author.join(', ') : currentBook.author}</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date de publication
              </h3>
              {isEditing ? (
                <Input
                  value={currentBook.publishDate || ''}
                  onChange={(e) => handleInputChange('publishDate', e.target.value)}
                  placeholder="Date de publication"
                />
              ) : (
                <p>{currentBook.publishDate || "Date non disponible"}</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <BookIcon className="h-4 w-4" />
                Nombre de pages
              </h3>
              {isEditing ? (
                <Input
                  type="number"
                  value={currentBook.numberOfPages || ''}
                  onChange={(e) => handleInputChange('numberOfPages', e.target.value)}
                  placeholder="Nombre de pages"
                />
              ) : (
                <p>{currentBook.numberOfPages ? `${currentBook.numberOfPages} pages` : "Information non disponible"}</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <ListTree className="h-4 w-4" />
                Série
              </h3>
              {isEditing ? (
                <Input
                  value={currentBook.series || ''}
                  onChange={(e) => handleInputChange('series', e.target.value)}
                  placeholder="Nom de la série"
                />
              ) : (
                currentBook.series && <p>{currentBook.series}</p>
              )}
            </div>

            {(isEditing || (currentBook.subjects && currentBook.subjects.length > 0)) && (
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Catégories
                </h3>
                {isEditing ? (
                  <Input
                    value={currentBook.subjects?.join(', ') || ''}
                    onChange={(e) => handleInputChange('subjects', e.target.value)}
                    placeholder="Catégories (séparées par des virgules)"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {currentBook.subjects?.slice(0, 5).map((subject, index) => (
                      <span
                        key={index}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4" />
        
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          {isEditing ? (
            <textarea
              className="w-full min-h-[100px] p-2 rounded-md border border-input"
              value={currentBook.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description du livre"
            />
          ) : (
            currentBook.description ? (
              <p className="text-muted-foreground whitespace-pre-line">{currentBook.description}</p>
            ) : (
              <p className="text-muted-foreground italic">Aucune description disponible pour ce livre</p>
            )
          )}
        </div>

        {isEditing && (
          <div className="flex justify-end mt-4">
            <Button onClick={handleSave}>
              Enregistrer les modifications
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
