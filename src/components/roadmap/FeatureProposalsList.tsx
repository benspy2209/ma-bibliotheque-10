
import React from "react";
import { Check, MessageSquare, X } from "lucide-react";
import { featureProposals, roadmapFeatures } from "./RoadmapData";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export function FeatureProposalsList() {
  const { user } = useSupabaseAuth();
  
  // Vérifier si l'utilisateur est l'administrateur
  const isAdmin = user?.email === "debruijneb@gmail.com";
  
  // Si aucune proposition, ne rien afficher et retourner null
  if (featureProposals.length === 0) {
    return null;
  }
  
  // Pour les utilisateurs non-admin, montrer uniquement une liste sans les boutons d'action
  const isViewOnly = !isAdmin;
  
  const approveProposal = (index: number) => {
    const proposal = featureProposals[index];
    // Ajouter à la roadmap officielle
    roadmapFeatures.push({
      ...proposal,
      isProposal: false
    });
    // Supprimer de la liste des propositions
    featureProposals.splice(index, 1);
    
    toast({
      title: "Proposition approuvée",
      description: `"${proposal.name}" a été ajoutée à la roadmap.`
    });
  };
  
  const rejectProposal = (index: number) => {
    const proposal = featureProposals[index];
    // Supprimer de la liste des propositions
    featureProposals.splice(index, 1);
    
    toast({
      title: "Proposition rejetée",
      description: `"${proposal.name}" a été rejetée.`
    });
  };
  
  return (
    <div className="mt-8 md:mt-16 mb-6 md:mb-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Propositions des utilisateurs</h2>
      <div className="space-y-4 md:space-y-6">
        {featureProposals.map((proposal, index) => (
          <Card key={index} className="border-amber-200 max-w-full overflow-hidden">
            <CardHeader className="bg-amber-50/50 p-3 md:p-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                <div className="overflow-hidden">
                  <CardTitle className="text-base md:text-lg line-clamp-1">{proposal.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs md:text-sm">
                    <MessageSquare className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                    <span className="truncate">Proposé par {proposal.proposedBy} le {proposal.proposalDate}</span>
                  </CardDescription>
                </div>
                {isAdmin && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-green-500 hover:bg-green-100 h-8 px-2 text-xs"
                      onClick={() => approveProposal(index)}
                    >
                      <Check className="h-3 w-3 md:h-4 md:w-4 mr-1 text-green-500" />
                      Approuver
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-500 hover:bg-red-100 h-8 px-2 text-xs"
                      onClick={() => rejectProposal(index)}
                    >
                      <X className="h-3 w-3 md:h-4 md:w-4 mr-1 text-red-500" />
                      Rejeter
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-3 p-3 md:p-4 md:pt-4">
              <div className="mb-2 md:mb-3 text-sm">
                <strong className="text-xs md:text-sm font-medium">Description:</strong>
                <p className="text-xs md:text-sm break-words">{proposal.description}</p>
              </div>
              {proposal.technical_details && (
                <div>
                  <strong className="text-xs md:text-sm font-medium">Détails techniques:</strong>
                  <p className="text-xs md:text-sm break-words">{proposal.technical_details}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
