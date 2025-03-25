
import { Book } from '@/types/book';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Users, Calendar, Book as BookIcon, ListTree, Layers, Clock, Building2 } from 'lucide-react';

interface BookMetadataProps {
  book: Book;
  isEditing: boolean;
  onInputChange: (field: keyof Book, value: string) => void;
}

export function BookMetadata({ book, isEditing, onInputChange }: BookMetadataProps) {
  return (
    <div className="grid gap-4">
      <div>
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Users className="h-4 w-4" />
          Auteur(s)
        </h3>
        {isEditing ? (
          <Input
            className="h-8 text-sm"
            value={Array.isArray(book.author) ? book.author.join(', ') : book.author}
            onChange={(e) => onInputChange('author', e.target.value)}
          />
        ) : (
          <p className="text-sm text-muted-foreground">{Array.isArray(book.author) ? book.author.join(', ') : book.author}</p>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Maison d'édition
        </h3>
        {isEditing ? (
          <Input
            value={book.publishers ? book.publishers.join(', ') : ''}
            onChange={(e) => onInputChange('publishers', e.target.value)}
            placeholder="Maison d'édition"
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            {book.publishers && book.publishers.length > 0 
              ? book.publishers.join(', ') 
              : "Information non disponible"}
          </p>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Date de publication
        </h3>
        {isEditing ? (
          <Input
            value={book.publishDate || ''}
            onChange={(e) => onInputChange('publishDate', e.target.value)}
            placeholder="Date de publication"
          />
        ) : (
          <p>{book.publishDate || "Date non disponible"}</p>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <BookIcon className="h-4 w-4" />
          Nombre de pages
        </h3>
        {isEditing ? (
          <Input
            type="number"
            value={book.numberOfPages || ''}
            onChange={(e) => onInputChange('numberOfPages', e.target.value)}
            placeholder="Nombre de pages"
          />
        ) : (
          <p>{book.numberOfPages ? `${book.numberOfPages} pages` : "Information non disponible"}</p>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Temps de lecture
        </h3>
        {isEditing ? (
          <Input
            type="number"
            value={book.readingTimeDays || ''}
            onChange={(e) => onInputChange('readingTimeDays', e.target.value)}
            placeholder="Nombre de jours"
          />
        ) : (
          <p>{book.readingTimeDays ? `${book.readingTimeDays} jour${book.readingTimeDays > 1 ? 's' : ''}` : "Non spécifié"}</p>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <ListTree className="h-4 w-4" />
          Série
        </h3>
        {isEditing ? (
          <Input
            value={book.series || ''}
            onChange={(e) => onInputChange('series', e.target.value)}
            placeholder="Nom de la série"
          />
        ) : (
          book.series && <p>{book.series}</p>
        )}
      </div>

      {(isEditing || (book.subjects && book.subjects.length > 0)) && (
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Catégories
          </h3>
          {isEditing ? (
            <input
              className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pointer-events-auto"
              value={book.subjects && Array.isArray(book.subjects) ? book.subjects.join(', ') : ''}
              onChange={(e) => onInputChange('subjects', e.target.value)}
              placeholder="Catégories (séparées par des virgules)"
              aria-label="Catégories"
              autoComplete="off"
              spellCheck="false"
              type="text"
              style={{ caretColor: 'auto' }}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {book.subjects && Array.isArray(book.subjects) && book.subjects.slice(0, 5).map((subject, index) => (
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

      {isEditing && (
        <div className="flex items-center space-x-2">
          <Switch
            id="purchased"
            checked={book.purchased}
            onCheckedChange={(checked) => onInputChange('purchased', checked.toString())}
          />
          <Label htmlFor="purchased">Livre acheté</Label>
        </div>
      )}
    </div>
  );
}
