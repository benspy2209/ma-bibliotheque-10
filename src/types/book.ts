
export type ReadingStatus = 'to-read' | 'reading' | 'completed';

export type BookFormat = 'print' | 'audio' | 'ebook' | 'unknown';

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
  format?: BookFormat;
  review?: {
    content: string;
    date: string;
  };
};
