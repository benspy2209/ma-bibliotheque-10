
import React from "react";
import { Helmet } from "react-helmet-async";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import RoadmapHeader from "@/components/roadmap/RoadmapHeader";
import FeatureTimeline from "@/components/roadmap/FeatureTimeline";
import RoadmapFooter from "@/components/roadmap/RoadmapFooter";
import { roadmapFeatures } from "@/components/roadmap/RoadmapData";
import { AddFeatureDialog } from "@/components/roadmap/AddFeatureDialog";
import { ProposeFeatureDialog } from "@/components/roadmap/ProposeFeatureDialog";
import { FeatureProposalsList } from "@/components/roadmap/FeatureProposalsList";

const Roadmap = () => {
  return (
    <>
      <Helmet>
        <title>Roadmap technique | BiblioPulse</title>
        <meta
          name="description"
          content="Découvrez notre roadmap technique et les fonctionnalités à venir sur BiblioPulse"
        />
      </Helmet>
      <NavBar />
      <main className="container max-w-5xl mx-auto px-4 py-10">
        <RoadmapHeader />
        <FeatureProposalsList />
        <FeatureTimeline features={roadmapFeatures} />
        <RoadmapFooter />
        <AddFeatureDialog />
        <ProposeFeatureDialog />
      </main>
      <Footer />
    </>
  );
};

export default Roadmap;
