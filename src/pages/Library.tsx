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
import { ArrowDown, ArrowUp, CalendarDays, TextIcon, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

type SortOption = 'recent' | 'title-asc' | 'title-desc' | 'author-asc' | 'author-desc';

export default function Library() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const { toast } = useToast();

  const loadBooks = () => {
    try {
      console.log("Chargement des livres...");
      const storedBooks = Object.entries(localStorage)
        .filter(([key]) => key.startsWith('book_'))
        .map(([_, value]) => {
          try {
            return JSON.parse(value);
          } catch (error) {
            console.error("Erreur lors du parsing d'un livre:", error);
            return null;
          }
        })
        .filter((book): book is Book => book !== null);
      
      console.log("Nombre de livres trouvés:", storedBooks.length);
      const sortedBooks = sortBooks(storedBooks, sortBy);
      setBooks(sortedBooks);
    } catch (error) {
      console.error("Erreur lors du chargement des livres:", error);
      toast({
        variant: "destructive",
        description: "Une erreur est survenue lors du chargement de votre bibliothèque.",
      });
    }
  };

  const sortBooks = (booksToSort: Book[], sortOption: SortOption): Book[] => {
    return [...booksToSort].sort((a, b) => {
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

  const getSortIcon = (option: SortOption) => {
    switch (option) {
      case 'recent':
        return <CalendarDays className="h-4 w-4" />;
      case 'title-asc':
      case 'title-desc':
        return <TextIcon className="h-4 w-4" />;
      case 'author-asc':
      case 'author-desc':
        return <User className="h-4 w-4" />;
    }
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'recent':
        return 'Date de lecture';
      case 'title-asc':
        return 'Titre A → Z';
      case 'title-desc':
        return 'Titre Z → A';
      case 'author-asc':
        return 'Auteur A → Z';
      case 'author-desc':
        return 'Auteur Z → A';
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
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/placeholder.svg';
        }}
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
    <>
      <div className="min-h-screen">
        <NavBar />
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Ma Bibliothèque</h1>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    {getSortIcon(sortBy)}
                    {getSortLabel(sortBy)}
                    {sortBy.endsWith('-asc') ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : sortBy.endsWith('-desc') ? (
                      <ArrowDown className="h-4 w-4" />
                    ) : null}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem onClick={() => setSortBy('recent')} className="gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Date de lecture
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('title-asc')} className="gap-2">
                    <TextIcon className="h-4 w-4" />
                    Titre A → Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('title-desc')} className="gap-2">
                    <TextIcon className="h-4 w-4" />
                    Titre Z → A
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('author-asc')} className="gap-2">
                    <User className="h-4 w-4" />
                    Auteur A → Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('author-desc')} className="gap-2">
                    <User className="h-4 w-4" />
                    Auteur Z → A
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
      </div>
    </>
  );
}
