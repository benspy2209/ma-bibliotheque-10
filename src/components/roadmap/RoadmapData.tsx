
import React from "react";

// Types for roadmap features
export type FeatureStatus = "completed" | "in-progress" | "planned";

export interface RoadmapFeature {
  name: string;
  description: string;
  status: FeatureStatus;
  quarter?: string;
  technical_details?: string;
  isProposal?: boolean;
  proposedBy?: string;
  proposalDate?: string;
}

// List of technical features for the roadmap
export const roadmapFeatures: RoadmapFeature[] = [
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

// List of feature proposals from users
export const featureProposals: RoadmapFeature[] = [];
