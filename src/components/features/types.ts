
import { ReactNode } from "react";

export interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface FeatureSection {
  id: string;
  title: string;
  description: string;
  features: Feature[];
}
