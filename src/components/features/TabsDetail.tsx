
import React from "react";
import { FeatureCard } from "./FeatureCard";
import { FeatureSection } from "./types";

interface TabsDetailProps {
  section: FeatureSection;
}

export const TabsDetail = ({ section }: TabsDetailProps) => {
  return (
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
  );
};
