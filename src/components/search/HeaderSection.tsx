
import { Link } from "react-router-dom";
import { AddManualBook } from '@/components/AddManualBook';
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoginDialog } from "@/components/auth/LoginDialog";

interface HeaderSectionProps {
  onBookAdded: () => void;
}

export const HeaderSection = ({ onBookAdded }: HeaderSectionProps) => {
  const { user, signIn, showLoginDialog, setShowLoginDialog } = useSupabaseAuth();
  const isMobile = useIsMobile();

  const handleSignIn = () => {
    console.log("Join adventure button clicked");
    signIn('signup');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 sm:mb-12">
      <div className="text-center sm:text-left flex-1">
        <h1 className="mb-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
          Découvrez votre prochaine lecture
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-200">
          Explorez, partagez et découvrez de nouveaux livres
        </p>
      </div>
      <div className="flex gap-4 items-center w-full sm:w-auto">
        {user ? (
          <>
            <AddManualBook onBookAdded={onBookAdded} />
            <Link 
              to="/" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              {!isMobile && "Ma Bibliothèque"}
            </Link>
          </>
        ) : (
          <Button 
            onClick={handleSignIn} 
            size="lg" 
            className="flex items-center gap-2"
          >
            <BookOpen className="h-5 w-5" />
            Rejoindre l'aventure
          </Button>
        )}
      </div>
    </div>
  );
};
