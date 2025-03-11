
import { Book } from '@/types/book';
import { SortOption } from '@/components/library/SortMenu';

export const useBookSort = () => {
  const sortBooks = (books: Book[], sortOption: SortOption): Book[] => {
    return [...books].sort((a, b) => {
      switch (sortOption) {
        case 'recent':
          if (!a.completionDate && !b.completionDate) return 0;
          if (!a.completionDate) return 1;
          if (!b.completionDate) return -1;
          return new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime();
        
        case 'title-asc':
          return a.title.localeCompare(b.title, 'fr');
        
        case 'title-desc':
          return b.title.localeCompare(a.title, 'fr');
        
        case 'author-asc': {
          const authorA = Array.isArray(a.author) ? a.author[0] : a.author;
          const authorB = Array.isArray(b.author) ? b.author[0] : b.author;
          return authorA.localeCompare(authorB, 'fr');
        }
        
        case 'author-desc': {
          const authorA = Array.isArray(a.author) ? a.author[0] : a.author;
          const authorB = Array.isArray(b.author) ? b.author[0] : b.author;
          return authorB.localeCompare(authorA, 'fr');
        }
        
        default:
          return 0;
      }
    });
  };

  return { sortBooks };
};
