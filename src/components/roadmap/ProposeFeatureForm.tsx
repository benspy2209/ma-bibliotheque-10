
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FeatureStatus, RoadmapFeature, featureProposals } from "./RoadmapData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  description: z.string().min(10, { message: "La description doit contenir au moins 10 caractères" }),
  technical_details: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProposeFeatureFormProps {
  onSuccess?: () => void;
}

export function ProposeFeatureForm({ onSuccess }: ProposeFeatureFormProps) {
  const { user } = useSupabaseAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      technical_details: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour proposer une fonctionnalité.",
      });
      return;
    }

    // Create a proper RoadmapFeature object from the form values
    const newFeatureProposal: RoadmapFeature = {
      name: values.name,
      description: values.description,
      status: "planned" as FeatureStatus,
      technical_details: values.technical_details || "",
      isProposal: true,
      proposedBy: user.email || "Utilisateur anonyme",
      proposalDate: new Date().toISOString().split('T')[0]
    };

    // Add to proposals
    featureProposals.push(newFeatureProposal);
    
    toast({
      title: "Proposition envoyée",
      description: "Merci pour votre proposition ! Elle sera examinée par notre équipe.",
    });

    // Reset form and call onSuccess callback
    form.reset();
    if (onSuccess) onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la fonctionnalité</FormLabel>
              <FormControl>
                <Input placeholder="Exemples: Mode sombre, Import depuis Goodreads..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez la fonctionnalité que vous aimeriez voir ajoutée"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="technical_details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Détails techniques (optionnel)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Si vous avez des idées sur la façon dont cette fonctionnalité pourrait être implémentée, partagez-les ici"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Soumettre la proposition</Button>
      </form>
    </Form>
  );
}
