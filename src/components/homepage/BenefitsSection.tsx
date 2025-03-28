
import React from 'react';
import { CircleCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const BenefitsSection = () => {
  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold">Pourquoi choisir BiblioPulse ?</h2>
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CircleCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Interface intuitive</h3>
                  <p className="text-muted-foreground">Navigation simple et agréable pour tous les lecteurs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CircleCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Statistiques détaillées</h3>
                  <p className="text-muted-foreground">Suivez votre progression et analysez vos habitudes de lecture</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CircleCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Base de données complète</h3>
                  <p className="text-muted-foreground">Des millions de livres et d'auteurs avec descriptions, couvertures et détails</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CircleCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Synchronisation multi-appareils</h3>
                  <p className="text-muted-foreground">Accédez à votre bibliothèque depuis n'importe quel appareil</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <img 
              src="/photo 2.jpg" 
              alt="Application BiblioPulse sur différents appareils" 
              className="rounded-lg shadow-xl object-cover w-full h-auto"
              onError={(e) => {
                console.error("Image failed to load:", e);
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
