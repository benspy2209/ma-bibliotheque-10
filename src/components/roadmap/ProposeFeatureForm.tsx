
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { featureProposals } from "./RoadmapData";
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

    // Créer une date formatée pour l'affichage
    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    });

    // Ajouter la proposition à la liste des propositions
    featureProposals.push({
      name: values.name,
      description: values.description,
      status: "planned",
      technical_details: values.technical_details || undefined,
      isProposal: true,
      proposedBy: user.email || "Utilisateur anonyme",
      proposalDate: formattedDate
    });

    toast({
      title: "Proposition soumise",
      description: "Votre proposition de fonctionnalité a été enregistrée avec succès.",
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
                <Input placeholder="Ex: Mode sombre automatique" {...field} />
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
                  placeholder="Décrivez brièvement votre proposition de fonctionnalité"
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
                  placeholder="Si vous avez des idées techniques sur l'implémentation, partagez-les ici"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Envoyer ma proposition</Button>
      </form>
    </Form>
  );
}
