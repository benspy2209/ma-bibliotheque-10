
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CompletionDateProps } from './types';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { fr } from 'date-fns/locale';

export function CompletionDate({ book, isEditing, onDateChange }: CompletionDateProps) {
  const [dateInput, setDateInput] = useState<string>('');
  const [isManualInput, setIsManualInput] = useState(false);

  // Initialiser l'input avec la date existante au montage du composant
  useEffect(() => {
    if (book.completionDate) {
      setDateInput(book.completionDate);
    }
  }, [book.completionDate]);

  // Gérer le changement de date via l'input manuel
  const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateInput(e.target.value);
  };

  // Appliquer la date manuelle lorsque l'input perd le focus
  const handleManualDateBlur = () => {
    if (dateInput) {
      try {
        // Vérifier si la date est valide
        const date = new Date(dateInput);
        if (!isNaN(date.getTime())) {
          onDateChange(date);
        }
      } catch (error) {
        console.error("Format de date invalide", error);
      }
    }
  };

  // Basculer entre le mode calendrier et saisie manuelle
  const toggleInputMode = () => {
    setIsManualInput(!isManualInput);
  };

  if (!isEditing && !book.status) return null;

  return (
    <div>
      <h3 className="font-semibold flex items-center gap-2">
        <CalendarIcon className="h-4 w-4" />
        Date de lecture
      </h3>
      {isEditing ? (
        <div className="flex flex-col gap-2">
          {isManualInput ? (
            <div className="flex gap-2">
              <Input
                type="date"
                value={dateInput}
                onChange={handleManualDateChange}
                onBlur={handleManualDateBlur}
                className="w-[240px] pointer-events-auto"
                disabled={book.status !== 'completed'}
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleInputMode}
                className="h-10"
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal pointer-events-auto",
                      !book.completionDate && "text-muted-foreground"
                    )}
                    disabled={book.status !== 'completed'}
                  >
                    {book.completionDate ? (
                      format(new Date(book.completionDate), "dd/MM/yyyy")
                    ) : (
                      <span>Choisir une date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={book.completionDate ? new Date(book.completionDate) : undefined}
                    onSelect={onDateChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleInputMode}
                className="h-10"
              >
                <span className="sr-only">Mode manuel</span>
                <span>Manuel</span>
              </Button>
            </div>
          )}
        </div>
      ) : (
        book.completionDate && (
          <p>{format(new Date(book.completionDate), "dd MMMM yyyy", { locale: fr })}</p>
        )
      )}
    </div>
  );
}
