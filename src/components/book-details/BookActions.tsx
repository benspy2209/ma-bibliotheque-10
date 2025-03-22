
import { Button } from '@/components/ui/button';
import { BookActionsProps } from './types';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function BookActions({ isEditing, onSave }: BookActionsProps) {
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    if (isSaving) return; // Prevent multiple clicks
    
    setIsSaving(true);
    try {
      console.log('Starting save operation');
      await onSave();
      console.log('Save operation completed');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!isEditing) return null;
  
  return (
    <div className="flex justify-end mt-4">
      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enregistrement...
          </>
        ) : 'Enregistrer les modifications'}
      </Button>
    </div>
  );
}
