import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FeatureStatus, RoadmapFeature, roadmapFeatures } from "./RoadmapData";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  description: z.string().min(10, { message: "La description doit contenir au moins 10 caractères" }),
  status: z.enum(["completed", "in-progress", "planned"]),
  quarter: z.string().optional(),
  technical_details: z.string().min(10, { message: "Les détails techniques doivent contenir au moins 10 caractères" }),
});

type FormValues = z.infer<typeof formSchema>;

interface RoadmapFeatureFormProps {
  onSuccess?: () => void;
  feature?: RoadmapFeature;
}

export function RoadmapFeatureForm({ onSuccess, feature }: RoadmapFeatureFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: feature || {
      name: "",
      description: "",
      status: "planned" as FeatureStatus,
      quarter: "",
      technical_details: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // Create a proper RoadmapFeature object from the form values
    const newFeature: RoadmapFeature = {
      name: values.name,
      description: values.description,
      status: values.status,
      quarter: values.quarter,
      technical_details: values.technical_details,
    };

    // If we're editing, find and update the existing feature
    if (feature) {
      const index = roadmapFeatures.findIndex((f) => f.name === feature.name);
      if (index !== -1) {
        roadmapFeatures[index] = newFeature;
        toast({
          title: "Fonctionnalité mise à jour",
          description: "La roadmap a été mise à jour avec succès.",
        });
      }
    } else {
      // Otherwise, add a new feature
      roadmapFeatures.push(newFeature);
      toast({
        title: "Fonctionnalité ajoutée",
        description: "La nouvelle fonctionnalité a été ajoutée à la roadmap.",
      });
    }

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
                <Input placeholder="Authentification utilisateur" {...field} />
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
                  placeholder="Décrivez brièvement la fonctionnalité"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="completed">Implémenté</SelectItem>
                  <SelectItem value="in-progress">En développement</SelectItem>
                  <SelectItem value="planned">Planifié</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quarter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trimestre (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Q3 2024" {...field} />
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
              <FormLabel>Détails techniques</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Service Workers, IndexedDB, synchronisation différée des données"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{feature ? "Mettre à jour" : "Ajouter"} la fonctionnalité</Button>
      </form>
    </Form>
  );
}
