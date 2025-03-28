
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
  completionDate?: string;
}

// List of technical features for the roadmap
export const roadmapFeatures: RoadmapFeature[] = [
  // Completed features in chronological order
  {
    name: "Base de données de livres",
    description: "Stockage et gestion des livres dans la bibliothèque de l'utilisateur",
    status: "completed",
    completionDate: "10 mars 2025",
    technical_details: "Architecture PostgreSQL avec Supabase, relations entre tables utilisateurs et livres"
  },
  {
    name: "Authentification utilisateur",
    description: "Système d'authentification complet avec inscription, connexion et réinitialisation de mot de passe",
    status: "completed",
    completionDate: "15 mars 2025",
    technical_details: "Implémentation avec Supabase Auth, JWT, et protection des routes"
  },
  {
    name: "API de recherche de livres",
    description: "Recherche de livres dans plusieurs langues et par différents critères",
    status: "completed",
    completionDate: "17 mars 2025",
    technical_details: "Intégration de Google Books API, optimisation des requêtes, mise en cache"
  },
  {
    name: "Système de statistiques de lecture",
    description: "Suivi avancé des habitudes de lecture et visualisation des données",
    status: "completed",
    completionDate: "20 mars 2025",
    technical_details: "Data mining avec Recharts, calculs complexes de statistiques, optimisation des requêtes"
  },
  {
    name: "Import/Export de bibliothèque",
    description: "Importation et exportation des données de bibliothèque",
    status: "completed",
    completionDate: "22 mars 2025",
    technical_details: "Parsers CSV/JSON personnalisés, validation des données, gestion des erreurs"
  },
  {
    name: "Authentification par réseaux sociaux",
    description: "Connexion via Google et Facebook pour simplifier l'accès des utilisateurs",
    status: "completed",
    completionDate: "28 mars 2025",
    technical_details: "Intégration des API OAuth de Google et Facebook avec Supabase Auth, gestion des redirections et des états d'authentification"
  },
  // Ajout des nouvelles fonctionnalités implémentées aujourd'hui
  {
    name: "Optimisation mobile",
    description: "Amélioration de l'expérience utilisateur sur appareils mobiles",
    status: "completed",
    completionDate: "13 juillet 2025",
    technical_details: "Réorganisation des onglets en affichage vertical sur mobile, amélioration du défilement horizontal sur tablette/desktop"
  },
  {
    name: "Amélioration des interactions tactiles",
    description: "Optimisation pour une meilleure expérience sur écrans tactiles",
    status: "completed",
    completionDate: "13 juillet 2025",
    technical_details: "Implémentation de touchAction: 'manipulation', retour visuel pour les appuis sur boutons, zones de toucher agrandies"
  },
  {
    name: "Navigation utilisateur améliorée",
    description: "Refonte de l'interface utilisateur pour une navigation plus intuitive",
    status: "completed",
    completionDate: "13 juillet 2025",
    technical_details: "Ajout de menu déroulant pour l'avatar utilisateur sur mobile, correction des filtres dans la bibliothèque"
  },
  {
    name: "Gestion flexible des noms d'utilisateur",
    description: "Possibilité de changer son nom d'utilisateur à tout moment",
    status: "completed",
    completionDate: "13 juillet 2025",
    technical_details: "Suppression de la restriction de changement de nom d'utilisateur mensuelle, refactorisation du système de gestion des profils"
  },
  // In-progress and planned features in sequential order
  {
    name: "Mode hors-ligne",
    description: "Utilisation de l'application sans connexion internet",
    status: "in-progress",
    quarter: "Q2 2025",
    technical_details: "Service Workers, IndexedDB, synchronisation différée des données"
  },
  {
    name: "Machine Learning pour recommandations",
    description: "Recommandations de livres personnalisées basées sur les habitudes de lecture",
    status: "in-progress",
    quarter: "Q2 2025",
    technical_details: "Algorithmes de recommandation, clustering d'utilisateurs, modèles prédictifs"
  },
  {
    name: "Partage sur réseaux sociaux",
    description: "Partage de livres et critiques de lecture sur les principales plateformes sociales",
    status: "in-progress",
    quarter: "Q2 2025",
    technical_details: "Intégration des API Twitter, Facebook, et Instagram, génération d'images partageables, statistiques d'engagement"
  },
  {
    name: "Application mobile native",
    description: "Applications iOS et Android natives",
    status: "planned",
    quarter: "Q3 2025",
    technical_details: "React Native, partage de code avec la version web, optimisations spécifiques aux plateformes"
  }
];

// Liste vide des propositions de fonctionnalités des utilisateurs
// Les propositions seront ajoutées dynamiquement quand les utilisateurs en soumettront
export const featureProposals: RoadmapFeature[] = [];
