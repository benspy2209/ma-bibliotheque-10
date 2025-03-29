
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

export const HeroSection = () => {
  const { user } = useSupabaseAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Déclenche l'animation après le chargement du composant
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 -z-10" />
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <div className="font-bold leading-none">
              <h1 className={`animated-title relative inline-block text-[51px] font-bold ${isVisible ? 'animate-in' : ''}`} style={{ lineHeight: '51px' }}>
                Biblio<span className="title-pulse">Pulse</span>
              </h1>
              <p className="mt-2 text-xl">Votre bibliothèque personnelle, amplifiée.</p>
            </div>
            <p className="text-xl text-muted-foreground">
              Transformez votre expérience de lecture avec BiblioPulse. Recherchez des livres et auteurs en 7 langues, construisez votre bibliothèque personnelle et analysez vos habitudes de lecture en toute simplicité.
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
                    variant="pulse"
                    className="font-semibold text-base flex items-center gap-2 relative z-10"
                    asChild
                  >
                    <Link to="/library"><LogIn className="h-5 w-5" /> Commencer l'aventure</Link>
                  </Button>
                  
                  <Button variant="outline" size="lg" asChild className="border-2 border-[#222] dark:border-white relative z-10">
                    <Link to="/features">Découvrir les fonctionnalités</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="relative">
              <img 
                src="/bibliopulsea.webp" 
                alt="Personne lisant et organisant sa bibliothèque" 
                className="rounded-lg shadow-2xl object-cover w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
