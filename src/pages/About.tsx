
import React from "react";
import { Helmet } from "react-helmet-async";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const About = () => {
  return (
    <>
      <Helmet>
        <title>À propos | BiblioPulse</title>
        <meta
          name="description"
          content="À propos de BiblioPulse et de son créateur Benjamin de Bruijne"
        />
      </Helmet>
      <NavBar />
      <main className="container max-w-5xl mx-auto px-4 py-10">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">À propos</h1>
            <p className="text-muted-foreground text-lg">
              Découvrez l'histoire derrière BiblioPulse
            </p>
          </div>

          <Card className="overflow-hidden">
            <div className="relative h-64 bg-[#e4364a]">
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-3xl font-bold text-white">Benjamin de Bruijne</h2>
              </div>
            </div>
            <CardContent className="p-8">
              <div className="prose max-w-none">
                <h3 className="text-2xl font-semibold mb-4">Lecteur passionné & Développeur</h3>
                
                <p className="mb-6">
                  Bonjour ! Je m'appelle Benjamin de Bruijne, je suis un développeur belge basé à Rhode-Saint-Genèse. Ma passion pour la
                  lecture m'a amené à créer BiblioPulse, un outil que j'aurais aimé avoir depuis longtemps pour suivre et organiser mes
                  lectures.
                </p>

                <p className="mb-6">
                  En tant que lecteur avide, je comprends l'importance d'avoir un outil qui permet de gérer efficacement sa bibliothèque 
                  personnelle, de suivre sa progression et de découvrir de nouveaux livres. C'est cette passion qui nourrit 
                  constamment l'évolution de BiblioPulse.
                </p>

                <Separator className="my-8" />

                <h3 className="text-2xl font-semibold mb-4">Compétences & Expertise</h3>
                <p className="mb-6">
                  Je développe des sites web et des applications en combinant expertise technique et vision stratégique. 
                  Mes compétences couvrent un large spectre de domaines :
                </p>

                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Développement web frontend et backend</li>
                  <li>Conception d'applications mobiles</li>
                  <li>Webmarketing et stratégies digitales</li>
                  <li>Optimisation pour les moteurs de recherche (SEO)</li>
                  <li>Expérience utilisateur (UX) et interface utilisateur (UI)</li>
                </ul>

                <Separator className="my-8" />

                <h3 className="text-2xl font-semibold mb-4">Mes autres projets</h3>
                <p className="mb-4">
                  Je vous invite à découvrir mes autres réalisations :
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="text-xl font-medium mb-2">Beneloo</h4>
                      <p className="mb-4">Services de développement web et marketing digital</p>
                      <a 
                        href="https://beneloo.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#e4364a] hover:underline"
                      >
                        Visiter beneloo.com
                      </a>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="text-xl font-medium mb-2">Site personnel</h4>
                      <p className="mb-4">Mon portfolio et blog professionnel</p>
                      <a 
                        href="https://benjamindebruijne.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#e4364a] hover:underline"
                      >
                        Visiter benjamindebruijne.com
                      </a>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default About;
