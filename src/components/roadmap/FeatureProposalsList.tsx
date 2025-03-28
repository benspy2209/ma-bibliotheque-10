
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
  
  // Si aucune proposition, ne rien afficher
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
    <div className="mt-16 mb-8">
      <h2 className="text-2xl font-bold mb-6">Propositions des utilisateurs</h2>
      <div className="space-y-6">
        {featureProposals.map((proposal, index) => (
          <Card key={index} className="border-amber-200">
            <CardHeader className="bg-amber-50/50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{proposal.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Proposé par {proposal.proposedBy} le {proposal.proposalDate}
                  </CardDescription>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-green-500 hover:bg-green-100"
                      onClick={() => approveProposal(index)}
                    >
                      <Check className="h-4 w-4 mr-1 text-green-500" />
                      Approuver
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-500 hover:bg-red-100"
                      onClick={() => rejectProposal(index)}
                    >
                      <X className="h-4 w-4 mr-1 text-red-500" />
                      Rejeter
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="mb-3">
                <strong className="text-sm font-medium">Description:</strong>
                <p className="text-sm">{proposal.description}</p>
              </div>
              {proposal.technical_details && (
                <div>
                  <strong className="text-sm font-medium">Détails techniques:</strong>
                  <p className="text-sm">{proposal.technical_details}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
