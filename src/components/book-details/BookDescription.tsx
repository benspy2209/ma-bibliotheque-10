
import { BookDescriptionProps } from './types';

export function BookDescription({ description, isEditing, onDescriptionChange }: BookDescriptionProps) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Description</h3>
      {isEditing ? (
        <textarea
          className="w-full min-h-[100px] p-2 rounded-md border border-input"
          value={description || ''}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Description du livre"
        />
      ) : (
        description ? (
          <p className="text-muted-foreground whitespace-pre-line">{description}</p>
        ) : (
          <p className="text-muted-foreground italic">Aucune description disponible pour ce livre</p>
        )
      )}
    </div>
  );
}
