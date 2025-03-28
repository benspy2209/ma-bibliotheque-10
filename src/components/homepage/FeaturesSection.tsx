
import React from 'react';
import { BookOpen, Heart, Compass, BarChart2, Hash, Languages, CalendarCheck2 } from 'lucide-react';
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
          <p className="text-muted-foreground max-w-2xl mx-auto mb-3">
            BiblioPulse vous offre tous les outils nécessaires pour gérer efficacement votre bibliothèque personnelle
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Recherchez dans notre base de <span className="font-medium text-primary/70">44 624 261 livres</span> et <span className="font-medium text-primary/70">12 839 586 auteurs</span> en français, anglais, néerlandais, espagnol, allemand, portugais et italien
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Hash className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Recherche avancée</h3>
              <p className="text-muted-foreground">
                Trouvez vos livres avec précision grâce à la recherche par ISBN et filtrez par langue (7 langues disponibles).
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <CalendarCheck2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Suivi de lecture avancé</h3>
              <p className="text-muted-foreground">
                Suivez vos jours consécutifs de lecture, définissez des objectifs personnalisés et visualisez votre temps de lecture.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyse détaillée</h3>
              <p className="text-muted-foreground">
                Visualisez la répartition de vos genres et découvrez vos auteurs favoris grâce à des graphiques interactifs.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Languages className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Outils pratiques</h3>
              <p className="text-muted-foreground">
                Importez/exportez votre bibliothèque et profitez de la traduction automatique des descriptions en français.
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
