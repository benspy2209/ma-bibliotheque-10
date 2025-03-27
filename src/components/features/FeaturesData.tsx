
import React from "react";
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
  ExternalLink,
  Sparkles
} from "lucide-react";
import { FeatureSection } from "./types";

// Data for feature sections
export const featureSections: FeatureSection[] = [
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
        icon: <ExternalLink className="h-6 w-6 text-primary" />,
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
