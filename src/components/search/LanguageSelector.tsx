
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageFilter } from '@/services/bookSearch';

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
        <SelectValue placeholder="Langue" />
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
