
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

export const HeroSection = () => {
  const { user, signIn } = useSupabaseAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Déclenche l'animation après le chargement du composant
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Modified to redirect to library page instead of search
  const handleLoginClick = () => {
    console.log("Commencer l'aventure clicked");
    navigate('/library');
  };

  // Wrapper function for login
  const handleSignIn = () => {
    console.log("Opening login dialog from HeroSection");
    signIn('login');
  };

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 -z-10" />
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <div className="text-4xl md:text-5xl font-bold leading-tight">
              <h1 className={`animated-title relative inline-block ${isVisible ? 'animate-in' : ''}`}>
                Biblio<span className="text-primary title-pulse">Pulse</span>
              </h1>
              <p className="mt-2">Votre bibliothèque personnelle, amplifiée.</p>
            </div>
            <p className="text-xl text-muted-foreground">
              Organisez, découvrez et partagez vos lectures préférées dans 7 langues différentes. BiblioPulse vous accompagne dans votre parcours littéraire.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {user ? (
                <Button size="lg" asChild>
                  <Link to="/search">Découvrir des livres</Link>
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    onClick={handleLoginClick}
                    className="pulse-effect bg-[#e4364a] text-white hover:bg-[#d11a2e] flex items-center gap-2"
                  >
                    <LogIn className="h-5 w-5" /> Commencer l'aventure
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    asChild
                    className="bg-black text-white hover:bg-gray-800 border-none"
                  >
                    <Link to="/features">Découvrir les fonctionnalités</Link>
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
                className="rounded-lg shadow-2xl object-cover w-full"
                onError={(e) => {
                  console.error("Image failed to load:", e);
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              
              {/* Témoignage */}
              <div className="absolute -bottom-12 -left-6 bg-background rounded-lg shadow-lg p-4 w-64 max-w-[80%] sm:max-w-full">
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
