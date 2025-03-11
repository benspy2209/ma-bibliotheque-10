
import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { Card } from "@/components/ui/card";
import { BookDetails } from '@/components/BookDetails';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, CalendarDays, TextIcon, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type SortOption = 'recent' | 'title' | 'author';

export default function Library() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const loadBooks = () => {
    const storedBooks = Object.entries(localStorage)
      .filter(([key]) => key.startsWith('book_'))
      .map(([_, value]) => {
        try {
          return JSON.parse(value);
        } catch (error) {
          console.error("Error parsing book from localStorage:", error);
          return null;
        }
      })
      .filter(book => book !== null);
    
    const sortedBooks = sortBooks(storedBooks, sortBy);
    setBooks(sortedBooks);
  };

  const sortBooks = (booksToSort: Book[], sortOption: SortOption): Book[] => {
    return [...booksToSort].sort((a, b) => {
      switch (sortOption) {
        case 'recent':
          if (!a.completionDate && !b.completionDate) return 0;
          if (!a.completionDate) return 1;
          if (!b.completionDate) return -1;
          return new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime();
        
        case 'author':
          const authorA = Array.isArray(a.author) ? a.author[0] : a.author;
          const authorB = Array.isArray(b.author) ? b.author[0] : b.author;
          return authorA.localeCompare(authorB, 'fr');
        
        case 'title':
          return a.title.localeCompare(b.title, 'fr');
        
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    loadBooks();
  }, [refreshKey, sortBy]);

  const handleBookUpdate = () => {
    loadBooks();
    setRefreshKey(prev => prev + 1);
  };

  const statusLabels: Record<string, string> = {
    'to-read': 'À lire',
    'reading': 'En cours',
    'completed': 'Lu'
  };

  const formatCompletionDate = (date: string) => {
    return format(new Date(date), 'MMMM yyyy', { locale: fr });
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'recent':
        return 'Date de lecture';
      case 'title':
        return 'Titre';
      case 'author':
        return 'Auteur';
    }
  };

  const getSortIcon = (option: SortOption) => {
    switch (option) {
      case 'recent':
        return <CalendarDays className="mr-2 h-4 w-4" />;
      case 'title':
        return <TextIcon className="mr-2 h-4 w-4" />;
      case 'author':
        return <User className="mr-2 h-4 w-4" />;
    }
  };

  const renderBookCard = (book: Book) => (
    <Card 
      key={book.id}
      className="book-card group cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => setSelectedBook(book)}
    >
      <img
        src={book.cover || '/placeholder.svg'}
        alt={book.title}
        className="w-full h-[160px] object-cover rounded-t-lg"
      />
      <div className="p-2">
        <h3 className="font-semibold text-sm line-clamp-1">{book.title}</h3>
        <p className="text-xs text-gray-600 line-clamp-1">
          {Array.isArray(book.author) ? book.author[0] : book.author}
        </p>
        <div className="flex flex-col gap-1 mt-1">
          <span className="inline-block text-xs px-2 py-0.5 bg-secondary rounded-full">
            {statusLabels[book.status || 'to-read']}
          </span>
          {book.completionDate && (
            <span className="text-xs text-gray-500">
              Lu en {formatCompletionDate(book.completionDate)}
            </span>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Ma Bibliothèque</h1>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {getSortIcon(sortBy)}
                {getSortLabel(sortBy)}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('recent')}>
                {getSortIcon('recent')}
                Date de lecture
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('title')}>
                {getSortIcon('title')}
                Titre
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('author')}>
                {getSortIcon('author')}
                Auteur
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {books.length === 0 ? (
          <p className="text-center text-gray-600">
            Votre bibliothèque est vide. Ajoutez des livres depuis la recherche !
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {books.map(renderBookCard)}
          </div>
        )}

        {selectedBook && (
          <BookDetails
            book={selectedBook}
            isOpen={!!selectedBook}
            onClose={() => setSelectedBook(null)}
            onUpdate={handleBookUpdate}
          />
        )}
      </div>
    </div>
  );
}

