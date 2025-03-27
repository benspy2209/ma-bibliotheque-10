
import React from "react";
import { FeatureSection } from "./types";
import { FeatureSectionCard } from "./FeatureSectionCard";

interface TabsOverviewProps {
  featureSections: FeatureSection[];
}

export const TabsOverview = ({ featureSections }: TabsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featureSections.map((section) => (
        <FeatureSectionCard key={section.id} section={section} />
      ))}
    </div>
  );
};
