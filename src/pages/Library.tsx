import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { Card } from "@/components/ui/card";
import { BookDetails } from '@/components/BookDetails';

export default function Library() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadBooks = () => {
    // Charger tous les livres du localStorage
    const storedBooks = Object.entries(localStorage)
      .filter(([key]) => key.startsWith('book_'))
      .map(([_, value]) => JSON.parse(value));
    setBooks(storedBooks);
  };

  useEffect(() => {
    loadBooks();
  }, [refreshKey]);

  const handleBookUpdate = () => {
    loadBooks();
    setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  const statusLabels: Record<string, string> = {
    'to-read': 'À lire',
    'reading': 'En cours',
    'completed': 'Lu'
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold">Ma Bibliothèque</h1>
        
        {books.length === 0 ? (
          <p className="text-center text-gray-600">
            Votre bibliothèque est vide. Ajoutez des livres depuis la recherche !
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book) => (
              <Card 
                key={book.id}
                className="book-card group cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-[200px] object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-gray-600">
                    {Array.isArray(book.author) ? book.author[0] : book.author}
                  </p>
                  <span className="mt-2 inline-block text-sm px-2 py-1 bg-secondary rounded-full">
                    {statusLabels[book.status || 'to-read']}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {selectedBook && (
          <BookDetails
            book={selectedBook}
            isOpen={!!selectedBook}
            onClose={() => setSelectedBook(null)}
            onUpdate={handleBookUpdate} // Add onUpdate prop
          />
        )}
      </div>
    </div>
  );
}
