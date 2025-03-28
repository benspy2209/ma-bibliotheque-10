
import React from "react";
import { FeatureStatus } from "./RoadmapData";

interface FeatureStatusLabelProps {
  status: FeatureStatus;
}

const FeatureStatusLabel = ({ status }: FeatureStatusLabelProps) => {
  switch (status) {
    case "completed":
      return <span>Implémenté</span>;
    case "in-progress":
      return <span>En développement</span>;
    case "planned":
      return <span>Planifié</span>;
  }
};

export default FeatureStatusLabel;
