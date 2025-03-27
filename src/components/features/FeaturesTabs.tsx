
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeatureSection } from "./types";
import { TabsOverview } from "./TabsOverview";
import { TabsDetail } from "./TabsDetail";

interface FeaturesTabsProps {
  featureSections: FeatureSection[];
}

export const FeaturesTabs = ({ featureSections }: FeaturesTabsProps) => {
  return (
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

      {/* Tab content */}
      <TabsContent value="overview">
        <TabsOverview featureSections={featureSections} />
      </TabsContent>

      {/* Content for each section */}
      {featureSections.map((section) => (
        <TabsContent key={section.id} value={section.id}>
          <TabsDetail section={section} />
        </TabsContent>
      ))}
    </Tabs>
  );
};
