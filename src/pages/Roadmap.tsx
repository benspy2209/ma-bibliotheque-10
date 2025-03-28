
import { Helmet } from "react-helmet-async";
import { GitMerge, CheckCircle, CircleDashed, CircleDot } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Types de fonctionnalités pour la roadmap
type FeatureStatus = "completed" | "in-progress" | "planned";

interface RoadmapFeature {
  name: string;
  description: string;
  status: FeatureStatus;
  quarter?: string;
  technical_details?: string;
}

const Roadmap = () => {
  // Liste des fonctionnalités techniques pour la roadmap
  const features: RoadmapFeature[] = [
    {
      name: "Authentification utilisateur",
      description: "Système d'authentification complet avec inscription, connexion et réinitialisation de mot de passe",
      status: "completed",
      technical_details: "Implémentation avec Supabase Auth, JWT, et protection des routes"
    },
    {
      name: "Base de données de livres",
      description: "Stockage et gestion des livres dans la bibliothèque de l'utilisateur",
      status: "completed",
      technical_details: "Architecture PostgreSQL avec Supabase, relations entre tables utilisateurs et livres"
    },
    {
      name: "API de recherche de livres",
      description: "Recherche de livres dans plusieurs langues et par différents critères",
      status: "completed",
      technical_details: "Intégration de Google Books API, optimisation des requêtes, mise en cache"
    },
    {
      name: "Système de statistiques de lecture",
      description: "Suivi avancé des habitudes de lecture et visualisation des données",
      status: "completed",
      technical_details: "Data mining avec Recharts, calculs complexes de statistiques, optimisation des requêtes"
    },
    {
      name: "Import/Export de bibliothèque",
      description: "Importation et exportation des données de bibliothèque",
      status: "completed",
      technical_details: "Parsers CSV/JSON personnalisés, validation des données, gestion des erreurs"
    },
    {
      name: "Mode hors-ligne",
      description: "Utilisation de l'application sans connexion internet",
      status: "in-progress",
      quarter: "Q2 2024",
      technical_details: "Service Workers, IndexedDB, synchronisation différée des données"
    },
    {
      name: "Application mobile native",
      description: "Applications iOS et Android natives",
      status: "planned",
      quarter: "Q4 2024",
      technical_details: "React Native, partage de code avec la version web, optimisations spécifiques aux plateformes"
    },
    {
      name: "Machine Learning pour recommandations",
      description: "Recommandations de livres personnalisées basées sur les habitudes de lecture",
      status: "planned",
      quarter: "Q1 2025",
      technical_details: "Algorithmes de recommandation, clustering d'utilisateurs, modèles prédictifs"
    }
  ];

  // Helper pour afficher l'icône de statut appropriée
  const StatusIcon = ({ status }: { status: FeatureStatus }) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <CircleDot className="h-5 w-5 text-amber-500" />;
      case "planned":
        return <CircleDashed className="h-5 w-5 text-slate-400" />;
    }
  };

  // Helper pour obtenir le texte du statut
  const getStatusText = (status: FeatureStatus): string => {
    switch (status) {
      case "completed":
        return "Implémenté";
      case "in-progress":
        return "En développement";
      case "planned":
        return "Planifié";
    }
  };

  return (
    <>
      <Helmet>
        <title>Roadmap technique | BiblioPulse</title>
        <meta
          name="description"
          content="Découvrez notre roadmap technique et les fonctionnalités à venir sur BiblioPulse"
        />
      </Helmet>
      <NavBar />
      <main className="container max-w-5xl mx-auto px-4 py-10">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Roadmap Technique</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez notre vision technique et les fonctionnalités que nous développons pour BiblioPulse
          </p>
        </header>

        <div className="flex items-center justify-center gap-6 mb-10">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Implémenté</span>
          </div>
          <div className="flex items-center gap-2">
            <CircleDot className="h-5 w-5 text-amber-500" />
            <span>En développement</span>
          </div>
          <div className="flex items-center gap-2">
            <CircleDashed className="h-5 w-5 text-slate-400" />
            <span>Planifié</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-[1.65rem] top-10 bottom-10 w-[2px] bg-muted z-0"></div>
          <div className="space-y-12 relative z-10">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-6">
                <div className="mt-1">
                  <div className="bg-background p-1 rounded-full">
                    <GitMerge className="h-6 w-6 text-[#e4364a]" />
                  </div>
                </div>
                <Card className="flex-1 shadow-md">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{feature.name}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <StatusIcon status={feature.status} />
                        <span>{getStatusText(feature.status)}</span>
                        {feature.quarter && (
                          <span className="ml-2 bg-slate-100 text-slate-800 px-2 py-1 rounded text-xs">
                            {feature.quarter}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <strong className="font-medium text-foreground">Détails techniques:</strong> {feature.technical_details}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        <section className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">À propos de notre roadmap</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Notre roadmap technique est un aperçu des fonctionnalités que nous développons pour BiblioPulse. 
              Elle représente notre vision à moyen et long terme, mais peut évoluer en fonction des retours utilisateurs et des priorités.
            </p>
            <p>
              Si vous avez des suggestions de fonctionnalités ou des priorités différentes, 
              n'hésitez pas à nous contacter via notre <a href="/contact" className="text-[#e4364a] hover:underline">page de contact</a>.
            </p>
            <p>
              Nous croyons en la transparence du développement et souhaitons partager notre vision technique avec notre communauté.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Roadmap;
