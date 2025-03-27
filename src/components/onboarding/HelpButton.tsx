
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/hooks/use-onboarding";

export function HelpButton() {
  const { startTutorial } = useOnboarding();

  const handleClick = () => {
    console.log("Help button clicked, starting tutorial");
    startTutorial();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleClick}
            data-tour="help-button"
          >
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Aide</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Lancer le tutoriel</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
