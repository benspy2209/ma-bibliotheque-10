
import { Button } from "@/components/ui/button";
import { SearchType } from '@/services/bookSearch';

interface ShowAllResultsButtonProps {
  onShowAllResults: () => void;
  totalBooks: number;
  searchType: SearchType;
}

export function ShowAllResultsButton({
  onShowAllResults,
  totalBooks,
  searchType
}: ShowAllResultsButtonProps) {
  return (
    <Button
      variant="link"
      onClick={onShowAllResults}
      className="text-primary hover:text-primary/80"
    >
      Afficher tous les {totalBooks} {searchType === 'author' ? 'livres de l\'auteur' : searchType === 'title' ? 'résultats pour ce titre' : 'résultats pour cet ISBN'}
    </Button>
  );
}
