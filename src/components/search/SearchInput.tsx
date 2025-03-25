
import { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { useToast } from '@/hooks/use-toast';

interface SearchInputProps {
  searchQuery: string;
  isSearching: boolean;
  onInputChange: (value: string) => void;
  onInputFocus: () => void;
}

export const SearchInput = ({ 
  searchQuery, 
  isSearching, 
  onInputChange, 
  onInputFocus 
}: SearchInputProps) => {
  return (
    <div className="relative flex-grow">
      <Search className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${isSearching ? 'text-primary animate-pulse' : 'text-gray-400'}`} />
      <Input
        type="search"
        placeholder="Rechercher..."
        className="pl-10 h-12"
        value={searchQuery}
        onChange={(e) => onInputChange(e.target.value)}
        onFocus={onInputFocus}
      />
    </div>
  );
};
