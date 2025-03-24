import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Book } from '@/types/book';
import { Card, CardContent } from "@/components/ui/card"
import { Search } from 'lucide-react';
import { NavBar } from "@/components/NavBar";
import { Link } from 'react-router-dom';
import { Footer } from "@/components/Footer";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedSearchTerm = localStorage.getItem('searchTerm');
    if (storedSearchTerm) {
      setSearchTerm(storedSearchTerm);
      searchBooks(storedSearchTerm);
    }
  }, []);

  const searchBooks = async (term: string) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${term}&maxResults=40`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.items) {
        const books: Book[] = data.items.map((item: any) => {
          const bookInfo = item.volumeInfo;
          return {
            id: item.id,
            title: bookInfo.title,
            author: bookInfo.authors ? bookInfo.authors : 'Unknown Author',
            cover: bookInfo.imageLinks?.thumbnail || '/placeholder.svg',
            description: bookInfo.description || 'No description available.',
            rating: bookInfo.averageRating || 0,
            status: 'to-read',
            amazonLink: bookInfo.infoLink
          };
        });
        setSearchResults(books);
      } else {
        setSearchResults([]);
      }
    } catch (e: any) {
      setError(e.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('searchTerm', searchTerm);
    searchBooks(searchTerm);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Recherche de livres | Ma Bibliothèque</title>
      </Helmet>
      
      <NavBar />
      
      <main className="container mx-auto py-6 flex-grow">
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-3xl font-semibold mb-4">Rechercher un livre</h1>
          <form onSubmit={handleSearchSubmit} className="flex w-full max-w-md space-x-2">
            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Titre du livre, auteur..."
              className="flex-grow"
            />
            <Button type="submit" variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Rechercher
            </Button>
          </form>
        </div>

        {loading && <p className="text-center">Recherche en cours...</p>}
        {error && <p className="text-center text-red-500">Erreur: {error}</p>}

        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.map((book) => (
              <Card key={book.id} className="bg-card text-card-foreground shadow-md">
                <CardContent className="p-4">
                  <div className="relative w-full h-48 mb-4 overflow-hidden rounded-md">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                      onError={(e: any) => { e.target.src = '/placeholder.svg'; }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {Array.isArray(book.author) ? book.author[0] : book.author}
                  </p>
                  <Link to={`/book/${book.id}`} className="text-blue-500 hover:underline">
                    Voir plus
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
