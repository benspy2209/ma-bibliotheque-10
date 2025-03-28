
import React from "react";
import { Helmet } from "react-helmet-async";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import RoadmapHeader from "@/components/roadmap/RoadmapHeader";
import FeatureTimeline from "@/components/roadmap/FeatureTimeline";
import RoadmapFooter from "@/components/roadmap/RoadmapFooter";
import { roadmapFeatures } from "@/components/roadmap/RoadmapData";
import { FeatureProposalsList } from "@/components/roadmap/FeatureProposalsList";
import { AddFeatureDialog } from "@/components/roadmap/AddFeatureDialog";

const Roadmap = () => {
  // Create a sorted copy of the roadmap features
  // Completed features first (sorted by completion date with most recent at the top), then in-progress, then planned
  const sortedFeatures = [...roadmapFeatures].sort((a, b) => {
    // First sort by status priority: completed > in-progress > planned
    const statusPriority = { completed: 0, "in-progress": 1, planned: 2 };
    const statusDiff = statusPriority[a.status] - statusPriority[b.status];
    
    if (statusDiff !== 0) return statusDiff;
    
    // If both are completed, sort by completion date (DESCENDING - most recent first)
    if (a.status === "completed" && b.status === "completed") {
      // Convert dates to timestamps for comparison
      const dateA = a.completionDate ? new Date(a.completionDate).getTime() : 0;
      const dateB = b.completionDate ? new Date(b.completionDate).getTime() : 0;
      return dateB - dateA; // Reversed order to get most recent first
    }
    
    // For in-progress and planned, keep original order
    return 0;
  });
  
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
        <FeatureTimeline features={sortedFeatures} />
        <RoadmapFooter />
        <AddFeatureDialog />
      </main>
      <Footer />
    </>
  );
};

export default Roadmap;
