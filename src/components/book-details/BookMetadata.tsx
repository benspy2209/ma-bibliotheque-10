
import { Book } from '@/types/book';
import { Input } from '@/components/ui/input';
import { BookMetadataProps } from './types';
import { Book as BookIcon, Calendar, ListTree, Layers, Users } from 'lucide-react';

export function BookMetadata({ book, isEditing, onInputChange }: BookMetadataProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold flex items-center gap-2">
          <Users className="h-4 w-4" />
          Auteur(s)
        </h3>
        {isEditing ? (
          <Input
            value={Array.isArray(book.author) ? book.author.join(', ') : book.author}
            onChange={(e) => onInputChange('author', e.target.value)}
          />
        ) : (
          <p>{Array.isArray(book.author) ? book.author.join(', ') : book.author}</p>
        )}
      </div>

      <div>
        <h3 className="font-semibold flex items-center gap-2">
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
        <h3 className="font-semibold flex items-center gap-2">
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
        <h3 className="font-semibold flex items-center gap-2">
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
          <h3 className="font-semibold flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Catégories
          </h3>
          {isEditing ? (
            <Input
              value={book.subjects?.join(', ') || ''}
              onChange={(e) => onInputChange('subjects', e.target.value)}
              placeholder="Catégories (séparées par des virgules)"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {book.subjects?.slice(0, 5).map((subject, index) => (
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
  );
}
