
import { Button } from '@/components/ui/button';
import { BookActionsProps } from './types';

export function BookActions({ isEditing, onSave }: BookActionsProps) {
  if (!isEditing) return null;
  
  return (
    <div className="flex justify-end mt-4">
      <Button onClick={onSave}>
        Enregistrer les modifications
      </Button>
    </div>
  );
}
