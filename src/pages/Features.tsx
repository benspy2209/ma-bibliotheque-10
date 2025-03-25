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
  Heart
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { LoginDialog } from "@/components/auth/LoginDialog";

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
    title: "Gestion de bibliothèque",
    features: [
      {
        icon: <BookOpen className="h-6 w-6 text-primary" />,
        title: "Ma Bibliothèque",
        description: "Organisez et visualisez tous vos livres en un seul endroit, avec différentes vues et filtres pour une navigation facile."
      },
      {
        icon: <BookmarkPlus className="h-6 w-6 text-primary" />,
        title: "Ajout de livres",
        description: "Ajoutez des livres à votre collection facilement, soit par recherche, soit manuellement avec tous les détails personnalisés."
      },
      {
        icon: <Star className="h-6 w-6 text-primary" />,
        title: "Notes et avis",
        description: "Notez vos lectures, ajoutez des commentaires et gardez une trace de vos impressions sur chaque livre."
      }
    ]
  },
  {
    title: "Recherche et découverte",
    features: [
      {
        icon: <Search className="h-6 w-6 text-primary" />,
        title: "Recherche avancée",
        description: "Trouvez rapidement des livres par titre, auteur, ISBN ou mots-clés grâce à notre moteur de recherche intégré."
      },
      {
        icon: <Filter className="h-6 w-6 text-primary" />,
        title: "Filtrage intelligent",
        description: "Filtrez votre collection par genre, statut de lecture, auteur, et plus encore pour trouver exactement ce que vous cherchez."
      },
      {
        icon: <Clock className="h-6 w-6 text-primary" />,
        title: "Suivi de lecture",
        description: "Suivez votre progression de lecture et enregistrez quand vous avez commencé et terminé chaque livre."
      }
    ]
  },
  {
    title: "Analyse et statistiques",
    features: [
      {
        icon: <BarChart2 className="h-6 w-6 text-primary" />,
        title: "Statistiques détaillées",
        description: "Visualisez des statistiques sur vos habitudes de lecture, genres préférés et votre progression annuelle."
      },
      {
        icon: <Settings className="h-6 w-6 text-primary" />,
        title: "Objectifs de lecture",
        description: "Définissez des objectifs de lecture annuels ou mensuels et suivez votre progression pour rester motivé."
      },
      {
        icon: <Share2 className="h-6 w-6 text-primary" />,
        title: "Partage social",
        description: "Partagez vos lectures, recommandations et statistiques avec vos amis ou sur les réseaux sociaux."
      }
    ]
  },
  {
    title: "Outils et exportation",
    features: [
      {
        icon: <Upload className="h-6 w-6 text-primary" />,
        title: "Importation",
        description: "Importez vos livres depuis d'autres plateformes ou fichiers CSV pour une transition sans effort."
      },
      {
        icon: <Download className="h-6 w-6 text-primary" />,
        title: "Exportation",
        description: "Exportez votre bibliothèque complète dans différents formats pour la sauvegarder ou l'utiliser ailleurs."
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

            <div className="space-y-20">
              {featureSections.map((section, index) => (
                <div key={index} className="space-y-8">
                  <h2 className="text-3xl font-bold tracking-tight text-center sm:text-left mb-2">
                    {section.title}
                  </h2>
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
              ))}
            </div>

            <div className="mt-24 text-center bg-primary/5 py-16 px-6 rounded-lg">
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
