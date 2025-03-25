
export type ReadingStatus = 'to-read' | 'reading' | 'completed';

export type Book = {
  id: string;
  sourceId?: string; // ID original du livre depuis des sources externes (Google Books, Open Library)
  title: string;
  author: string | string[];
  cover?: string;
  rating?: number;
  language: string[];
  purchased?: boolean;
  numberOfPages?: number;
  publishDate?: string;
  series?: string;
  description?: string;
  publishers?: string[];
  subjects?: string[];
  isbn?: string;
  status?: ReadingStatus;
  completionDate?: string;
  readingTimeDays?: number;
  format?: string; // Format du livre (broché, relié, audio, etc.)
  amazonUrl?: string; // URL d'affiliation Amazon
  review?: {
    content: string;
    date: string;
  };
};
