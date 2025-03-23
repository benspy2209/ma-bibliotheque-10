
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CompletionDateProps } from './types';

export function CompletionDate({ book, isEditing, onDateChange }: CompletionDateProps) {
  if (!isEditing && !book.status) return null;

  return (
    <div>
      <h3 className="font-semibold flex items-center gap-2">
        <CalendarIcon className="h-4 w-4" />
        Date de lecture
      </h3>
      {isEditing ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] pl-3 text-left font-normal",
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
          <PopoverContent className="w-auto p-0 z-50" align="start">
            <Calendar
              mode="single"
              selected={book.completionDate ? new Date(book.completionDate) : undefined}
              onSelect={onDateChange}
              disabled={(date) => date > new Date()}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      ) : (
        book.completionDate && (
          <p>{format(new Date(book.completionDate), "dd/MM/yyyy")}</p>
        )
      )}
    </div>
  );
}
