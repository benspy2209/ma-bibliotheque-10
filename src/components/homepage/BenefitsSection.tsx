
import React from 'react';
import { CheckCircle } from 'lucide-react';

export const BenefitsSection = () => {
  const benefits = [
    'Catalographie complète de votre collection',
    'Analyse de vos habitudes de lecture',
    'Suivi de lecture avec objectifs et streaks',
    'Suggestions de livres basées sur vos goûts',
    'Importation et exportation de votre bibliothèque',
    'Interface responsive sur tous vos appareils'
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <img 
              src="/bibliopulse-accueil-2.webp" 
              alt="Tableau de statistiques et analyse de lecture" 
              className="rounded-lg shadow-xl w-full"
              onError={(e) => {
                console.error("Image failed to load:", e);
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
          
          <div className="lg:w-1/2 space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl font-bold">Découvrez les avantages de BiblioPulse</h2>
            <p className="text-lg text-muted-foreground">
              BiblioPulse transforme votre façon de gérer votre collection littéraire et de suivre votre progression de lecture.
            </p>
            
            <ul className="space-y-3 mt-6">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mr-3" />
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
