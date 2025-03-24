import { useState } from 'react';
import { Book } from '@/types/book';
import { BookDetails } from '@/components/BookDetails';
import { useToast } from "@/hooks/use-toast";
import { SortMenu, SortOption } from '@/components/library/SortMenu';
import { ViewToggle } from '@/components/library/ViewToggle';
import { useBookSort } from '@/hooks/use-book-sort';
import { useViewPreference } from '@/hooks/use-view-preference';
import NavBar from '@/components/NavBar';
import { loadBooks } from '@/services/supabaseBooks';
import { useQuery } from '@tanstack/react-query';
import { BookSections } from '@/components/library/BookSections';
import { AuthorFilter } from '@/components/library/AuthorFilter';
import { Input } from "@/components/ui/input";
import { Search, BookPlus, BookOpen } from "lucide-react";
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LoginDialog } from '@/components/auth/LoginDialog';
import Footer from '@/components/Footer';

export default function Library() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toBuyFilter, setToBuyFilter] = useState<boolean | null>(null);
  const { toast } = useToast();
  const { sortBooks } = useBookSort();
  const { viewMode, toggleView } = useViewPreference();
  const { user, signIn, signInWithGoogle, showLoginDialog, setShowLoginDialog } = useSupabaseAuth();

  const { data: books = [], refetch } = useQuery({
    queryKey: ['books'],
    queryFn: loadBooks,
    meta: {
      onError: (error: Error) => {
        console.error("Erreur lors du chargement des livres:", error);
        toast({
          variant: "destructive",
          description: "Une erreur est survenue lors du chargement de votre bibliothèque.",
        });
      }
    }
  });

  const searchFilter = (book: Book) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    
    const titleMatch = book.title.toLowerCase().includes(query);
    
    let authorMatch = false;
    if (Array.isArray(book.author)) {
      authorMatch = book.author.some(author => 
        author && author.toLowerCase().includes(query)
      );
    } else if (book.author) {
      authorMatch = book.author.toLowerCase().includes(query);
    }
    
    return titleMatch || authorMatch;
  };

  const filteredBooks = books
    .filter(book => {
      if (selectedAuthor) {
        if (Array.isArray(book.author)) {
          return book.author.includes(selectedAuthor);
        }
        return book.author === selectedAuthor;
      }
      return true;
    })
    .filter(searchFilter)
    .filter(book => {
      if (toBuyFilter === true) {
        return !book.purchased && (!book.status || book.status === 'to-read');
      } else if (toBuyFilter === false) {
        return book.purchased || !((!book.status || book.status === 'to-read'));
      }
      return true;
    });

  const sortedBooks = sortBooks(filteredBooks, sortBy);

  const handleBookUpdate = () => {
    refetch();
  };

  const handleToBuyFilterChange = (value: boolean | null) => {
    setToBuyFilter(value);
  };

  const handleLoginClick = () => {
    console.log("Join adventure button clicked");
    signIn('signup');
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign in button clicked");
    signInWithGoogle();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="px-4 py-8 sm:px-6 lg:px-8 flex-grow">
        <div className="mx-auto max-w-7xl">
          {!user ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h1 className="text-3xl font-bold mb-4">Créez votre bibliothèque personnelle</h1>
              <p className="text-muted-foreground mb-8 max-w-2xl">
                Connectez-vous ou créez un compte pour commencer à organiser vos lectures, 
                suivre votre progression et découvrir de nouveaux livres.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleLoginClick} 
                  size="lg" 
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-5 w-5" />
                  Rejoindre l'aventure
                </Button>
                <Button 
                  onClick={handleGoogleSignIn} 
                  variant="outline" 
                  size="lg" 
                  className="flex items-center gap-2"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    <path d="M1 1h22v22H1z" fill="none"/>
                  </svg>
                  Continuer avec Google
                </Button>
              </div>
              <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold">Ma Bibliothèque</h1>
                <div className="flex items-center gap-2">
                  <SortMenu sortBy={sortBy} onSortChange={setSortBy} />
                  <ViewToggle viewMode={viewMode} onToggle={toggleView} />
                </div>
              </div>

              <div className="mb-6 flex flex-col gap-4">
                <div className="w-full">
                  <AuthorFilter 
                    books={books}
                    selectedAuthor={selectedAuthor}
                    onAuthorSelect={setSelectedAuthor}
                  />
                </div>
                <div className="w-full relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Rechercher par titre ou auteur..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {books.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <h2 className="text-xl font-medium mb-4">Votre bibliothèque est vide</h2>
                  <p className="text-muted-foreground mb-8 max-w-2xl">
                    Commencez par rechercher des livres ou ajoutez-les manuellement pour créer votre bibliothèque personnelle.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/search" className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                      <Search className="h-4 w-4" />
                      Rechercher des livres
                    </Link>
                    <Link to="/search" className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors">
                      <BookPlus className="h-4 w-4" />
                      Ajouter manuellement
                    </Link>
                  </div>
                </div>
              ) : (
                <BookSections 
                  books={sortedBooks}
                  viewMode={viewMode}
                  onBookClick={setSelectedBook}
                  toBuyFilter={toBuyFilter}
                  onToBuyFilterChange={handleToBuyFilterChange}
                />
              )}

              {selectedBook && (
                <BookDetails
                  book={selectedBook}
                  isOpen={!!selectedBook}
                  onClose={() => setSelectedBook(null)}
                  onUpdate={handleBookUpdate}
                />
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
