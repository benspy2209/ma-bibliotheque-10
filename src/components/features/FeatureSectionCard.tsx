
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck } from "lucide-react";
import { FeatureSection } from "./types";

interface FeatureSectionCardProps {
  section: FeatureSection;
}

export const FeatureSectionCard = ({ section }: FeatureSectionCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
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
  );
};
