
import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

export const CallToAction = () => {
  const { user, setShowLoginDialog, setAuthMode } = useSupabaseAuth();

  // Modified to open login dialog
  const handleSignUp = () => {
    console.log("Opening login dialog from CallToAction");
    setAuthMode('signup');
    setShowLoginDialog(true);
  };

  return (
    <section className="py-16 bg-primary/5">
      <div className="container px-4 mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à organiser votre bibliothèque ?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Rejoignez les lecteurs qui ont déjà transformé leur expérience littéraire avec BiblioPulse.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!user ? (
            <Button 
              size="lg" 
              onClick={handleSignUp}
              variant="pulse"
              className="flex items-center gap-2 font-semibold text-base relative z-10" // Added relative z-10
            >
              <LogIn className="h-5 w-5" /> Créer un compte gratuitement
            </Button>
          ) : (
            <Button size="lg" asChild className="relative z-10"> {/* Added relative z-10 */}
              <Link to="/library">Accéder à ma bibliothèque</Link>
            </Button>
          )}
          <Button variant="outline" size="lg" asChild className="border-2 border-[#222] dark:border-white relative z-10"> {/* Added relative z-10 */}
            <Link to="/features">Explorer les fonctionnalités</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
