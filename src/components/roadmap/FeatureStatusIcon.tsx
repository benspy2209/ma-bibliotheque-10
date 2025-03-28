
import React from "react";
import { CheckCircle, CircleDashed, CircleDot } from "lucide-react";
import { FeatureStatus } from "./RoadmapData";

interface FeatureStatusIconProps {
  status: FeatureStatus;
}

const FeatureStatusIcon = ({ status }: FeatureStatusIconProps) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "in-progress":
      return <CircleDot className="h-5 w-5 text-amber-500" />;
    case "planned":
      return <CircleDashed className="h-5 w-5 text-slate-400" />;
  }
};

export default FeatureStatusIcon;
