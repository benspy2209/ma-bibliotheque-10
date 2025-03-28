
import React from "react";
import { CheckCircle, CircleDashed, CircleDot } from "lucide-react";

const RoadmapHeader = () => {
  return (
    <>
      <header className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Roadmap Technique</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Découvrez notre vision technique et les fonctionnalités que nous développons pour BiblioPulse
        </p>
      </header>

      <div className="flex items-center justify-center gap-6 mb-10">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Implémenté</span>
        </div>
        <div className="flex items-center gap-2">
          <CircleDot className="h-5 w-5 text-amber-500" />
          <span>En développement</span>
        </div>
        <div className="flex items-center gap-2">
          <CircleDashed className="h-5 w-5 text-slate-400" />
          <span>Planifié</span>
        </div>
      </div>
    </>
  );
};

export default RoadmapHeader;
