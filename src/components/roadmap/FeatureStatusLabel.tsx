
import React from "react";
import { FeatureStatus } from "./RoadmapData";

interface FeatureStatusLabelProps {
  status: FeatureStatus;
}

const FeatureStatusLabel = ({ status }: FeatureStatusLabelProps): string => {
  switch (status) {
    case "completed":
      return "Implémenté";
    case "in-progress":
      return "En développement";
    case "planned":
      return "Planifié";
  }
};

export default FeatureStatusLabel;
