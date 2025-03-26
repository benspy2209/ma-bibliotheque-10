
import { useState } from 'react';
import { useReadingSpeed } from '@/hooks/use-reading-speed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sliders } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export function ReadingSpeedSetting() {
  const { readingSpeed, updateReadingSpeed } = useReadingSpeed();
  const [inputValue, setInputValue] = useState<string>(readingSpeed.toString());
  const { toast } = useToast();

  const handleSave = () => {
    const newSpeed = parseInt(inputValue, 10);
    
    if (isNaN(newSpeed) || newSpeed <= 0) {
      toast({
        variant: "destructive",
        description: "Veuillez entrer un nombre valide supérieur à zéro.",
      });
      return;
    }
    
    updateReadingSpeed(newSpeed);
    
    toast({
      description: `Vitesse de lecture mise à jour : ${newSpeed} pages par heure`,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Sliders className="h-4 w-4" />
          <span className="hidden sm:inline">Vitesse de lecture</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Personnaliser la vitesse de lecture</h4>
            <p className="text-sm text-muted-foreground">
              Définissez votre vitesse moyenne de lecture pour une estimation plus précise du temps de lecture.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reading-speed">Pages lues par heure</Label>
            <div className="flex space-x-2">
              <Input
                id="reading-speed"
                type="number"
                min="1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSave}>Enregistrer</Button>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Cette valeur est utilisée pour estimer le temps de lecture en heures dans vos statistiques.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
