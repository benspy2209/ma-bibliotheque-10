import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { Label } from "@/components/ui/label";
import { addSystemLog } from '@/services/supabaseAdminStats';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

interface SearchBarProps {
  className?: string;
}

export function SearchBar({
  className,
}: SearchBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [searchType, setSearchType] = useState(searchParams.get("type") || "books");
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setSearchType(searchParams.get("type") || "books");
  }, [searchParams]);

  useEffect(() => {
    if (debouncedQuery) {
      handleSearch();
    }
  }, [debouncedQuery, searchType]);

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(name, value);
    return params.toString();
  };

  const handleSearch = async () => {
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
      
      router.push("/search?" + createQueryString("q", query) + "&" + createQueryString("type", searchType));
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
          placeholder={`Rechercher des ${searchType}`}
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
          isLoading={isLoading}
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5"
          onClick={handleSearch}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
