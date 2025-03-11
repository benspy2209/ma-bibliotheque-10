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
import { ArrowUpDown, Grid, CalendarDays, ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type SortOption = 'recent' | 'author' | 'title' | 'az' | 'za';
type ViewMode = 'simple' | 'grouped';

export default function Library() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('grouped');

  const loadBooks = () => {
    console.log("Loading books from localStorage");
    const storedBooks = Object.entries(localStorage)
      .filter(([key]) => key.startsWith('book_'))
      .map(([_, value]) => {
        try {
          const book = JSON.parse(value);
          console.log("Loaded book:", book);
          return book;
        } catch (error) {
          console.error("Error parsing book from localStorage:", error);
          return null;
        }
      })
      .filter(book => book !== null);
    
    const sortedBooks = sortBooks(storedBooks, sortBy);
    console.log("Total books loaded:", sortedBooks.length);
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
          return authorA.localeCompare(authorB);
        
        case 'title':
          return a.title.localeCompare(b.title);

        case 'az':
          return a.title.localeCompare(b.title);
        
        case 'za':
          return b.title.localeCompare(a.title);
        
        default:
          return 0;
      }
    });
  };

  const groupAndSortBooks = (booksToSort: Book[], sortOption: SortOption) => {
    if (sortOption === 'recent') {
      const completedBooks = booksToSort.filter(book => book.completionDate);
      
      const groupedBooks = completedBooks.reduce((acc, book) => {
        const date = new Date(book.completionDate!);
        const monthKey = format(date, 'MMMM yyyy', { locale: fr });
        
        if (!acc[monthKey]) {
          acc[monthKey] = [];
        }
        acc[monthKey].push(book);
        return acc;
      }, {} as Record<string, Book[]>);

      Object.keys(groupedBooks).forEach(month => {
        groupedBooks[month].sort((a, b) => 
          new Date(b.completionDate!).getTime() - new Date(a.completionDate!).getTime()
        );
      });

      return groupedBooks;
    } else if (sortOption === 'author') {
      return booksToSort.reduce((acc, book) => {
        const author = Array.isArray(book.author) ? book.author[0] : book.author;
        const firstLetter = author.charAt(0).toUpperCase();
        
        if (!acc[firstLetter]) {
          acc[firstLetter] = [];
        }
        acc[firstLetter].push(book);
        return acc;
      }, {} as Record<string, Book[]>);
    } else {
      return booksToSort.reduce((acc, book) => {
        const firstLetter = book.title.charAt(0).toUpperCase();
        
        if (!acc[firstLetter]) {
          acc[firstLetter] = [];
        }
        acc[firstLetter].push(book);
        return acc;
      }, {} as Record<string, Book[]>);
    }
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

  const getSortTitle = () => {
    switch (sortBy) {
      case 'recent':
        return 'Livres par date de lecture';
      case 'author':
        return 'Livres par auteur';
      case 'title':
        return 'Livres par titre';
      case 'az':
        return 'Livres de A à Z';
      case 'za':
        return 'Livres de Z à A';
      default:
        return 'Ma Bibliothèque';
    }
  };

  const sortedAndGroupedBooks = groupAndSortBooks(books, sortBy);
  const sortedBooks = sortBooks(books, sortBy);

  const renderBookCard = (book: Book) => (
    <Card 
      key={book.id}
      className="book-card group cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => setSelectedBook(book)}
    >
      <img
        src={book.cover}
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
          <h1 className="text-3xl font-bold">{getSortTitle()}</h1>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'simple' ? 'grouped' : 'simple')}
            >
              {viewMode === 'simple' ? <CalendarDays className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Trier par <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('recent')}>
                  Date de lecture
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('author')}>
                  Auteur
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('az')}>
                  <ArrowDownAZ className="mr-2 h-4 w-4" />
                  A à Z
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('za')}>
                  <ArrowUpAZ className="mr-2 h-4 w-4" />
                  Z à A
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {books.length === 0 ? (
          <p className="text-center text-gray-600">
            Votre bibliothèque est vide. Ajoutez des livres depuis la recherche !
          </p>
        ) : viewMode === 'simple' ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {sortedBooks.map(renderBookCard)}
          </div>
        ) : (
          <>
            {Object.entries(sortedAndGroupedBooks).map(([group, groupBooks]) => (
              <div key={group} className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-600">
                  {group}
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {groupBooks.map(renderBookCard)}
                </div>
              </div>
            ))}
          </>
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
