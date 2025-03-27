
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

export const CallToAction = () => {
  const { user, setShowLoginDialog } = useSupabaseAuth();

  const handleSignUp = () => {
    console.log("Opening login dialog from CallToAction");
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
            <Button size="lg" onClick={handleSignUp} className="pulse-effect flex items-center gap-2">
              <Heart className="h-5 w-5 fill-white" /> Créer un compte gratuitement
            </Button>
          ) : (
            <Button size="lg" asChild>
              <Link to="/library">Accéder à ma bibliothèque</Link>
            </Button>
          )}
          <Button variant="outline" size="lg" asChild>
            <Link to="/features">Explorer les fonctionnalités</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
