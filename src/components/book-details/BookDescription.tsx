
import { BookDescriptionProps } from './types';

export function BookDescription({ description, isEditing, onDescriptionChange }: BookDescriptionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-1">Description</h3>
      {isEditing ? (
        <textarea
          className="w-full min-h-[80px] max-h-[120px] p-2 text-sm rounded-md border border-input resize-none"
          value={description || ''}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Description du livre"
        />
      ) : (
        description ? (
          <p className="text-sm text-muted-foreground whitespace-pre-line">{description}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">Aucune description disponible pour ce livre</p>
        )
      )}
    </div>
  );
}
