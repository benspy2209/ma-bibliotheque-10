
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

export const HeroSection = () => {
  const { user, setShowLoginDialog, setAuthMode } = useSupabaseAuth();

  // Wrapper function to handle the signup button click
  const handleLogin = () => {
    console.log("Opening login dialog from HeroSection");
    setAuthMode('signup');
    setShowLoginDialog(true);
  };

  // Wrapper function to handle the sign in button click - identical to handleSignIn in NavBar
  const handleSignIn = () => {
    console.log("Opening login dialog from NavBar in HeroSection");
    setShowLoginDialog(true);
  };

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 -z-10" />
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="text-primary title-pulse">BiblioPulse</span>: Votre bibliothèque personnelle, simplifiée
            </h1>
            <p className="text-xl text-muted-foreground">
              Organisez, découvrez et partagez vos lectures préférées. BiblioPulse vous accompagne dans votre parcours littéraire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {user ? (
                <Button size="lg" asChild>
                  <Link to="/library">Découvrir des livres</Link>
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    onClick={handleLogin}
                    className="pulse-effect bg-[#ea384c] text-white hover:bg-[#d11a2e] flex items-center gap-2"
                  >
                    <LogIn className="h-5 w-5" /> Commencer l'aventure
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={handleSignIn}
                    className="bg-black text-white hover:bg-gray-800 border-none"
                  >
                    <LogIn className="h-5 w-5 mr-2" /> Se connecter
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="relative">
              <img 
                src="/photo 1.jpg" 
                alt="Personne lisant et organisant sa bibliothèque" 
                className="rounded-lg shadow-2xl object-cover"
                onError={(e) => {
                  console.error("Image failed to load:", e);
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              <div className="absolute -bottom-6 -left-6 bg-background rounded-lg shadow-lg p-4 w-64">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="mt-2 text-sm">"Cette application a complètement transformé ma façon d'organiser mes lectures !"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
