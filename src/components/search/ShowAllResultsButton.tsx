
import { Button } from "@/components/ui/button";
import { BookOpen } from 'lucide-react';

interface ShowAllResultsButtonProps {
  onShowAllResults: () => void;
  totalBooks: number;
  searchType: 'author' | 'title';
}

export const ShowAllResultsButton = ({ 
  onShowAllResults, 
  totalBooks,
  searchType
}: ShowAllResultsButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onShowAllResults}
      className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
    >
      <BookOpen className="h-4 w-4 text-[#e4364a]" />
      Afficher tous les {totalBooks} livres {searchType === 'author' ? 'de l\'auteur' : 'trouvés'}
    </Button>
  );
};
