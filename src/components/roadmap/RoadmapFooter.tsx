
import React from "react";
import { Separator } from "@/components/ui/separator";

const RoadmapFooter = () => {
  return (
    <>
      <Separator className="my-6 md:my-12" />

      <section className="max-w-full mx-auto w-full">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 break-words">À propos de notre roadmap</h2>
        <div className="space-y-3 md:space-y-4 text-muted-foreground text-sm md:text-base">
          <p className="break-words max-w-full">
            Notre roadmap technique est un aperçu des fonctionnalités que nous développons pour BiblioPulse. 
            Elle représente notre vision à moyen et long terme, mais peut évoluer en fonction des retours utilisateurs et des priorités.
          </p>
          <p className="break-words max-w-full">
            Si vous avez des suggestions de fonctionnalités ou des priorités différentes, 
            n'hésitez pas à nous contacter via notre <a href="/contact" className="text-[#e4364a] hover:underline">page de contact</a>.
          </p>
          <p className="break-words max-w-full">
            Nous croyons en la transparence du développement et souhaitons partager notre vision technique avec notre communauté.
          </p>
        </div>
      </section>
    </>
  );
};

export default RoadmapFooter;
