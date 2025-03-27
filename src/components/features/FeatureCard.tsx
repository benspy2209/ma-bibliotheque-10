
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Type for the feature cards
export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor?: string;
}

// Component for a feature card
export const FeatureCard = ({ icon, title, description, bgColor = "bg-primary/5" }: FeatureCardProps) => (
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
