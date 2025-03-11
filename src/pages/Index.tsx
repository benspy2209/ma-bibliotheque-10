
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search } from 'lucide-react';

// Données temporaires pour la démo
const sampleBooks = [
  {
    id: 1,
    title: "L'Étranger",
    author: "Albert Camus",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=687&auto=format&fit=crop",
    rating: 4.5
  },
  {
    id: 2,
    title: "Les Misérables",
    author: "Victor Hugo",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=687&auto=format&fit=crop",
    rating: 4.8
  },
  {
    id: 3,
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=688&auto=format&fit=crop",
    rating: 4.9
  },
  {
    id: 4,
    title: "Madame Bovary",
    author: "Gustave Flaubert",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=687&auto=format&fit=crop",
    rating: 4.3
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 fade-in">
      <div className="mx-auto max-w-7xl">
        {/* En-tête */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Découvrez votre prochaine lecture
          </h1>
          <p className="text-lg text-gray-600">
            Explorez, partagez et découvrez de nouveaux livres
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-12 mx-auto max-w-2xl">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher un livre, un auteur..."
            className="pl-10 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Grille de livres */}
        <div className="book-grid">
          {sampleBooks.map((book) => (
            <Card key={book.id} className="book-card group">
              <img
                src={book.cover}
                alt={book.title}
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div className="book-info">
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-sm font-medium text-amber-500">★ {book.rating}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bouton "Charger plus" */}
        <div className="mt-12 text-center">
          <Button variant="outline" className="hover:bg-secondary">
            Voir plus de livres
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
