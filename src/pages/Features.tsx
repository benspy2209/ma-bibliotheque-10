
import { Helmet } from "react-helmet-async";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { 
  BookOpen, 
  Search, 
  Star, 
  BarChart2, 
  BookmarkPlus, 
  Share2, 
  Settings,
  Clock,
  Filter,
  Download,
  Upload,
  Heart,
  FileText,
  ListFilter,
  LibrarySquare,
  CalendarCheck2,
  CircleCheck,
  BookText,
  BookMarked,
  PieChart,
  Target,
  Import,
  Export,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Type pour les cartes de fonctionnalités
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor?: string;
}

// Composant pour une carte de fonctionnalité
const FeatureCard = ({ icon, title, description, bgColor = "bg-primary/5" }: FeatureCardProps) => (
  <Card className="h-full transition-all duration-300 hover:shadow-md">
    <CardHeader>
      <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-sm">{description}</CardDescription>
    </CardContent>
  </Card>
);

// Données pour les sections de fonctionnalités
const featureSections = [
  {
    id: "library",
    title: "Gestion de bibliothèque",
    description: "Organisez efficacement votre collection de livres",
    features: [
      {
        icon: <LibrarySquare className="h-6 w-6 text-primary" />,
        title: "Ma Bibliothèque",
        description: "Organisez et visualisez tous vos livres en un seul endroit, avec différentes vues et filtres pour une navigation facile."
      },
      {
        icon: <BookmarkPlus className="h-6 w-6 text-primary" />,
        title: "Ajout de livres",
        description: "Ajoutez des livres à votre collection facilement, soit par recherche automatique, soit manuellement avec tous les détails personnalisés."
      },
      {
        icon: <Star className="h-6 w-6 text-primary" />,
        title: "Notes et avis",
        description: "Notez vos lectures, ajoutez des commentaires et gardez une trace de vos impressions sur chaque livre."
      },
      {
        icon: <BookText className="h-6 w-6 text-primary" />,
        title: "Métadonnées complètes",
        description: "Stockez toutes les informations importantes comme l'auteur, l'éditeur, l'année de publication, le genre et une image de couverture."
      },
      {
        icon: <BookMarked className="h-6 w-6 text-primary" />,
        title: "Statuts de lecture",
        description: "Catégorisez vos livres selon votre progression : à lire, en cours de lecture ou terminé."
      }
    ]
  },
  {
    id: "search",
    title: "Recherche et découverte",
    description: "Trouvez rapidement les livres que vous cherchez",
    features: [
      {
        icon: <Search className="h-6 w-6 text-primary" />,
        title: "Recherche avancée",
        description: "Trouvez rapidement des livres par titre, auteur, ISBN ou mots-clés grâce à notre moteur de recherche intégré qui utilise l'API Google Books."
      },
      {
        icon: <ListFilter className="h-6 w-6 text-primary" />,
        title: "Filtrage intelligent",
        description: "Filtrez votre collection par genre, statut de lecture, auteur, et plus encore pour trouver exactement ce que vous cherchez."
      },
      {
        icon: <CalendarCheck2 className="h-6 w-6 text-primary" />,
        title: "Suivi de lecture",
        description: "Suivez votre progression de lecture et enregistrez quand vous avez commencé et terminé chaque livre."
      },
      {
        icon: <FileText className="h-6 w-6 text-primary" />,
        title: "Descriptions complètes",
        description: "Consultez des résumés et descriptions détaillés pour chaque livre afin de décider si vous souhaitez l'ajouter à votre collection."
      }
    ]
  },
  {
    id: "statistics",
    title: "Analyse et statistiques",
    description: "Visualisez et analysez vos habitudes de lecture",
    features: [
      {
        icon: <BarChart2 className="h-6 w-6 text-primary" />,
        title: "Statistiques détaillées",
        description: "Visualisez des statistiques sur vos habitudes de lecture, genres préférés et votre progression annuelle avec des graphiques interactifs."
      },
      {
        icon: <PieChart className="h-6 w-6 text-primary" />,
        title: "Répartition des genres",
        description: "Découvrez quels genres littéraires dominent votre bibliothèque grâce à des graphiques clairs et informatifs."
      },
      {
        icon: <Target className="h-6 w-6 text-primary" />,
        title: "Objectifs de lecture",
        description: "Définissez des objectifs de lecture annuels ou mensuels et suivez votre progression pour rester motivé."
      },
      {
        icon: <Clock className="h-6 w-6 text-primary" />,
        title: "Temps de lecture",
        description: "Estimez votre temps de lecture total et par livre en fonction de votre vitesse de lecture personnalisée."
      },
      {
        icon: <CircleCheck className="h-6 w-6 text-primary" />,
        title: "Séries de lectures",
        description: "Suivez votre série de jours consécutifs de lecture pour maintenir une habitude régulière."
      }
    ]
  },
  {
    id: "tools",
    title: "Outils et exportation",
    description: "Gérez efficacement vos données de lecture",
    features: [
      {
        icon: <Import className="h-6 w-6 text-primary" />,
        title: "Importation",
        description: "Importez vos livres depuis d'autres plateformes ou fichiers CSV pour une transition sans effort vers BiblioPulse."
      },
      {
        icon: <Export className="h-6 w-6 text-primary" />,
        title: "Exportation",
        description: "Exportez votre bibliothèque complète dans différents formats pour la sauvegarder ou l'utiliser dans d'autres applications."
      },
      {
        icon: <Settings className="h-6 w-6 text-primary" />,
        title: "Personnalisation",
        description: "Personnalisez votre expérience avec des paramètres configurables comme la vitesse de lecture et les objectifs personnels."
      },
      {
        icon: <Sparkles className="h-6 w-6 text-primary" />,
        title: "Mode sombre/clair",
        description: "Basculez entre les thèmes clairs et sombres pour une expérience de lecture confortable à tout moment de la journée."
      }
    ]
  }
];

const Features = () => {
  const { signIn, user, showLoginDialog, setShowLoginDialog } = useSupabaseAuth();

  // Fonction pour gérer le clic sur le bouton de connexion
  const handleSignInClick = () => {
    console.log("Opening login dialog from Features page");
    setShowLoginDialog(true);
    signIn('signup');
  };

  return (
    <>
      <Helmet>
        <title>Fonctionnalités | Bibliopulse</title>
        <meta
          name="description"
          content="Découvrez toutes les fonctionnalités de Bibliopulse pour gérer votre bibliothèque personnelle."
        />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <NavBar />
        
        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight text-center">
              Fonctionnalités de Bibliopulse
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-center mb-16">
              Découvrez tout ce que Bibliopulse peut faire pour transformer votre expérience de lecture et la gestion de votre bibliothèque personnelle.
            </p>

            {/* Navigation par onglets pour les catégories de fonctionnalités */}
            <Tabs defaultValue="overview" className="mb-12">
              <div className="flex justify-center mb-6">
                <TabsList className="grid grid-cols-1 md:grid-cols-5 max-w-4xl">
                  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="library">Bibliothèque</TabsTrigger>
                  <TabsTrigger value="search">Recherche</TabsTrigger>
                  <TabsTrigger value="statistics">Statistiques</TabsTrigger>
                  <TabsTrigger value="tools">Outils</TabsTrigger>
                </TabsList>
              </div>

              {/* Contenu des onglets */}
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featureSections.map((section) => (
                    <Card key={section.id} className="overflow-hidden transition-all hover:shadow-md">
                      <CardHeader className="bg-primary/5 pb-2">
                        <CardTitle className="text-xl">{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ul className="space-y-2">
                          {section.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CircleCheck className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="text-sm">{feature.title}</span>
                            </li>
                          ))}
                          {section.features.length > 3 && (
                            <li className="text-xs text-muted-foreground pt-1">
                              +{section.features.length - 3} autres fonctionnalités
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Contenu détaillé pour chaque section */}
              {featureSections.map((section) => (
                <TabsContent key={section.id} value={section.id}>
                  <div className="space-y-8">
                    <div className="max-w-3xl mx-auto text-center mb-10">
                      <h2 className="text-3xl font-bold tracking-tight mb-4">{section.title}</h2>
                      <p className="text-lg text-muted-foreground">{section.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {section.features.map((feature, featureIndex) => (
                        <FeatureCard 
                          key={featureIndex}
                          icon={feature.icon}
                          title={feature.title}
                          description={feature.description}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-16 text-center bg-primary/5 py-16 px-6 rounded-lg">
              <h2 className="text-3xl font-bold mb-4">Prêt à organiser votre bibliothèque ?</h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                Commencez dès maintenant à profiter de toutes ces fonctionnalités et transformez votre expérience de lecture.
              </p>
              
              {!user && (
                <div className="flex justify-center">
                  <div className="relative inline-block">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500/50 opacity-75"></span>
                    <Button 
                      size="lg" 
                      onClick={handleSignInClick}
                      className="relative z-10 font-semibold text-base transition-all duration-300 shadow-md hover:shadow-lg pulse-effect flex items-center gap-2"
                    >
                      <Heart className="h-5 w-5 fill-white" /> Commencez à créer votre bibliothèque !
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
      
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </>
  );
};

export default Features;
