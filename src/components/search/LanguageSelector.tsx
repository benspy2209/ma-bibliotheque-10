
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageFilter } from '@/services/bookSearch';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  language: LanguageFilter;
  onLanguageChange: (value: LanguageFilter) => void;
}

export const LanguageSelector = ({ 
  language, 
  onLanguageChange 
}: LanguageSelectorProps) => {
  return (
    <Select 
      value={language} 
      onValueChange={(value) => onLanguageChange(value as LanguageFilter)}
    >
      <SelectTrigger className="w-full sm:w-[120px] h-12">
        <div className="flex items-center">
          <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="Langue" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="fr">Français</SelectItem>
        <SelectItem value="en">Anglais</SelectItem>
        <SelectItem value="nl">Néerlandais</SelectItem>
        <SelectItem value="es">Espagnol</SelectItem>
        <SelectItem value="de">Allemand</SelectItem>
        <SelectItem value="pt">Portugais</SelectItem>
        <SelectItem value="it">Italien</SelectItem>
      </SelectContent>
    </Select>
  );
};
