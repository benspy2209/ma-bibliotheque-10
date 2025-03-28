
import React from "react";
import { CheckCircle, CircleDashed, CircleDot } from "lucide-react";

const RoadmapHeader = () => {
  return (
    <>
      <header className="mb-6 md:mb-10 text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Roadmap Technique</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
          Découvrez notre vision technique et les fonctionnalités que nous développons pour BiblioPulse
        </p>
      </header>

      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-8 md:mb-10 px-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
          <span className="text-sm md:text-base">Implémenté</span>
        </div>
        <div className="flex items-center gap-2">
          <CircleDot className="h-4 w-4 md:h-5 md:w-5 text-amber-500" />
          <span className="text-sm md:text-base">En développement</span>
        </div>
        <div className="flex items-center gap-2">
          <CircleDashed className="h-4 w-4 md:h-5 md:w-5 text-slate-400" />
          <span className="text-sm md:text-base">Planifié</span>
        </div>
      </div>
    </>
  );
};

export default RoadmapHeader;
