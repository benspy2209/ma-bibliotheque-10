
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { addSystemLog } from '@/services/supabaseAdminStats';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string, searchType: string, language: string) => Promise<void>;
  showAllResults?: () => void;
  hasMoreResults?: boolean;
  totalBooks?: number;
}

export function SearchBar({
  className,
  placeholder,
  onSearch,
  showAllResults,
  hasMoreResults,
  totalBooks
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("books");
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { user } = useSupabaseAuth();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setSearchError(null);
    
    try {
      // Log search activity
      addSystemLog(
        'info', 
        `Recherche: "${query}" (type: ${searchType})`, 
        user?.id,
        '/search'
      );
      
      // If onSearch prop exists, call it
      if (onSearch) {
        await onSearch(query, searchType, 'fr'); // Default language to French
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchError("An error occurred while searching. Please try again.");
      
      // Log search error
      addSystemLog(
        'error', 
        `Erreur de recherche: ${error instanceof Error ? error.message : 'Erreur inconnue'}`, 
        user?.id,
        '/search'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex gap-4 ${className}`}>
      <div className="grid gap-1.5">
        <Label htmlFor="type">Rechercher par</Label>
        <Select value={searchType} onValueChange={(value) => setSearchType(value)}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="books">Livres</SelectItem>
            <SelectItem value="authors">Auteurs</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="relative flex-1">
        <Input
          type="search"
          placeholder={placeholder || `Rechercher des ${searchType}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5"
            onClick={() => setQuery("")}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5"
          onClick={handleSearch}
          aria-label="Search"
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin">⏳</span>
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
