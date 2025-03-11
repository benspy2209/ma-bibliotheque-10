
export type ReadingStatus = 'to-read' | 'reading' | 'completed';

export type Book = {
  id: string;
  title: string;
  author: string | string[];
  cover?: string;
  rating?: number;
  language: string[];
  // Informations détaillées
  numberOfPages?: number;
  publishDate?: string;
  series?: string;
  description?: string;
  publishers?: string[];
  subjects?: string[];
  isbn?: string;
  status?: ReadingStatus;
  completionDate?: string; // Date de lecture
};

