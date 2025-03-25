
import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { Button } from '@/components/ui/button';
import { BookOpen, Heart, Star, Compass, Zap, CircleCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const Homepage = () => {
  const { user, signIn } = useSupabaseAuth();

  const handleSignUp = () => {
    signIn('signup');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow">
        {/* Section Héro */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 -z-10" />
          <div className="container px-4 mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Votre bibliothèque personnelle, <span className="text-primary">simplifiée</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Organisez, découvrez et partagez vos lectures préférées. BiblioPulse vous accompagne dans votre parcours littéraire.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  {!user ? (
                    <Button size="lg" onClick={handleSignUp} className="pulse-effect">
                      Commencer gratuitement
                    </Button>
                  ) : (
                    <Button size="lg" asChild>
                      <Link to="/search">Découvrir des livres</Link>
                    </Button>
                  )}
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/search">Explorer</Link>
                  </Button>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                    alt="Personne lisant et organisant sa bibliothèque" 
                    className="rounded-lg shadow-2xl object-cover"
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

        {/* Fonctionnalités */}
        <section className="py-16 bg-muted/50">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Tout ce dont vous avez besoin</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                BiblioPulse vous offre tous les outils nécessaires pour gérer efficacement votre bibliothèque personnelle
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            </div>
          </div>
        </section>

        {/* Avantages */}
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
                      <p className="text-muted-foreground">Des milliers de livres avec descriptions, couvertures et détails</p>
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
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                  alt="Application BiblioPulse sur différents appareils" 
                  className="rounded-lg shadow-xl object-cover w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary/5">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à organiser votre bibliothèque ?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Rejoignez des milliers de lecteurs qui ont déjà transformé leur expérience littéraire avec BiblioPulse.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <Button size="lg" onClick={handleSignUp} className="pulse-effect">
                  Créer un compte gratuitement
                </Button>
              ) : (
                <Button size="lg" asChild>
                  <Link to="/">Accéder à ma bibliothèque</Link>
                </Button>
              )}
              <Button variant="outline" size="lg" asChild>
                <Link to="/search">Explorer les fonctionnalités</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Homepage;
