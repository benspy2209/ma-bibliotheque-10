
import { BookStatusHandlerProps } from './types';
import { ReadingStatus } from '@/types/book';

export function BookStatusHandler({ book, onStatusChange }: BookStatusHandlerProps) {
  const handleStatusChange = async (status: ReadingStatus) => {
    await onStatusChange(status);
  };
  
  return null; // This is a logic-only component, no UI rendering
}
