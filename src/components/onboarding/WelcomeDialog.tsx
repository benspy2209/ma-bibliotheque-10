
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/hooks/use-onboarding";
import { BookOpen, Clock } from "lucide-react";

export function WelcomeDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { startTutorial, skipTutorial } = useOnboarding();

  const handleStart = () => {
    console.log("Welcome dialog: Start tutorial clicked");
    onOpenChange(false);
    startTutorial();
  };

  const handleSkip = () => {
    console.log("Welcome dialog: Skip tutorial clicked");
    onOpenChange(false);
    skipTutorial();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Bienvenue sur BiblioPulse !</DialogTitle>
          <DialogDescription className="pt-2">
            Découvrez toutes les fonctionnalités de votre nouvelle bibliothèque numérique personnelle.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">
            Souhaitez-vous faire une visite guidée des principales fonctionnalités ?
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Découvrir les fonctionnalités</h4>
                <p className="text-sm text-muted-foreground">Apprenez à ajouter des livres, gérer votre bibliothèque et plus encore.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Seulement 2 minutes</h4>
                <p className="text-sm text-muted-foreground">Un tour rapide pour vous aider à démarrer.</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleSkip} className="w-full sm:w-auto">
            Plus tard
          </Button>
          <Button onClick={handleStart} className="w-full sm:w-auto">
            Commencer le tutoriel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
