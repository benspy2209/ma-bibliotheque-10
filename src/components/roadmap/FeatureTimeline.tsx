
import React from "react";
import { GitMerge } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RoadmapFeature } from "./RoadmapData";
import FeatureStatusIcon from "./FeatureStatusIcon";
import FeatureStatusLabel from "./FeatureStatusLabel";
import { useIsMobile } from "@/hooks/use-mobile";

interface FeatureTimelineProps {
  features: RoadmapFeature[];
}

const FeatureTimeline = ({ features }: FeatureTimelineProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative">
      <div className="absolute left-[1.65rem] top-10 bottom-10 w-[2px] bg-muted z-0"></div>
      <div className="space-y-12 relative z-10">
        {features.map((feature, index) => (
          <div key={index} className="flex gap-4 md:gap-6">
            <div className="mt-1 flex-shrink-0">
              <div className="bg-background p-1 rounded-full">
                <GitMerge className="h-6 w-6 text-[#e4364a]" />
              </div>
            </div>
            <Card className="flex-1 shadow-md">
              <CardHeader className="p-3 sm:p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div>
                    <CardTitle className="text-base sm:text-lg md:text-xl">{feature.name}</CardTitle>
                    <CardDescription className="text-sm">{feature.description}</CardDescription>
                  </div>
                  <div className={`flex ${isMobile ? "flex-wrap" : ""} items-center gap-2 text-xs sm:text-sm`}>
                    <FeatureStatusIcon status={feature.status} />
                    <span>{FeatureStatusLabel({ status: feature.status })}</span>
                    {feature.quarter && (
                      <span className="ml-1 bg-slate-100 text-slate-800 px-2 py-1 rounded text-xs">
                        {feature.quarter}
                      </span>
                    )}
                    {feature.completionDate && feature.status === "completed" && (
                      <span className="ml-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {feature.completionDate}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="text-xs sm:text-sm text-muted-foreground break-words">
                  <strong className="font-medium text-foreground">Détails techniques:</strong> {feature.technical_details}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureTimeline;
