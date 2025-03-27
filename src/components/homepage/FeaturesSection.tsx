
import React from 'react';
import { BookOpen, Heart, Compass, BarChart2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const FeaturesSection = () => {
  const navigate = useNavigate();
  
  const handleViewAllFeatures = () => {
    navigate('/features');
  };
  
  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Tout ce dont vous avez besoin</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            BiblioPulse vous offre tous les outils nécessaires pour gérer efficacement votre bibliothèque personnelle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Organisez votre bibliothèque</h3>
              <p className="text-muted-foreground">
                Classez vos livres par catégorie, statut de lecture et auteur pour retrouver facilement vos ouvrages préférés.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Suivez vos lectures</h3>
              <p className="text-muted-foreground">
                Gardez une trace de vos lectures en cours, de vos livres préférés et de ceux que vous souhaitez découvrir.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Compass className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Découvrez de nouvelles œuvres</h3>
              <p className="text-muted-foreground">
                Explorez notre vaste base de données pour trouver de nouveaux livres qui correspondent à vos goûts.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analysez vos statistiques</h3>
              <p className="text-muted-foreground">
                Visualisez votre progression de lecture et obtenez des insights sur vos habitudes de lecture.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-center mt-10">
          <Button 
            onClick={handleViewAllFeatures}
            variant="outline"
            className="font-medium"
          >
            Voir toutes les fonctionnalités
          </Button>
        </div>
      </div>
    </section>
  );
};
