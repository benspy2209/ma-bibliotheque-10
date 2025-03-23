
import { useState } from 'react';
import { searchBooksByTitle } from '@/services/supabaseBooks';
import { Book } from '@/types/book';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function BookFinder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const books = await searchBooksByTitle(searchQuery);
      setResults(books);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching for books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Entrez le titre du livre..."
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Recherche...' : 'Rechercher'}
        </Button>
      </div>

      {hasSearched && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Résultats ({results.length})</h3>
          
          {results.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID (UUID)</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Auteur</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-mono text-sm break-all">{book.id}</TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{Array.isArray(book.author) ? book.author.join(', ') : book.author}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>Aucun livre trouvé avec ce titre</p>
          )}
        </div>
      )}
    </div>
  );
}
