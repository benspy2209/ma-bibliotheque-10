
export type Book = {
  id: string;
  title: string;
  author: string | string[];
  cover?: string;
  rating?: number;
  language: string[];
};
