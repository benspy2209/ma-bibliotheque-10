
import { SearchBar } from '@/components/search/SearchBar';
import { SearchType, LanguageFilter } from '@/services/bookSearch';

interface SearchContainerProps {
  onSearch: (query: string, searchType: SearchType, language: LanguageFilter) => Promise<void>;
  showAllResults: () => void;
  hasMoreResults: boolean;
  totalBooks: number;
  remainingSearches: number | null;
  searchLimitReached: boolean;
  user: any;
}

export function SearchContainer({
  onSearch,
  showAllResults,
  hasMoreResults,
  totalBooks,
  remainingSearches,
  searchLimitReached,
  user
}: SearchContainerProps) {
  return (
    <div className="mb-8 sm:mb-12">
      <SearchBar 
        onSearch={onSearch}
        placeholder="Rechercher un livre, un auteur..."
        showAllResults={showAllResults}
        hasMoreResults={hasMoreResults}
        totalBooks={totalBooks}
      />
      
      <div className="mt-3">
        <p className="text-sm text-muted-foreground">
          Recherchez par titre, auteur ou ISBN dans 7 langues : français, anglais, néerlandais, espagnol, allemand, portugais et italien
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Trouvez également des bandes dessinées (BD) et romans graphiques dans notre catalogue
        </p>
        {user && remainingSearches !== null && remainingSearches !== -1 && (
          <div className="text-sm text-muted-foreground mt-1">
            {searchLimitReached 
              ? "Vous avez atteint votre limite de 3 recherches par jour." 
              : `Recherches restantes aujourd'hui : ${remainingSearches}`}
          </div>
        )}
      </div>
    </div>
  );
}
