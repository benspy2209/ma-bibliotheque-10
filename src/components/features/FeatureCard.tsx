
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
  <Card className="h-full transition-all duration-300 hover:shadow-md card-transparent border-none shadow-none">
    <CardHeader>
      <div className={`w-14 h-14 rounded-full ${bgColor} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <CardTitle className="text-xl font-bold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-base font-medium">{description}</CardDescription>
    </CardContent>
  </Card>
);
