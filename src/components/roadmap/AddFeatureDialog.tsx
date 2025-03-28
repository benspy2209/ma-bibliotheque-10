
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RoadmapFeatureForm } from "./RoadmapFeatureForm";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

export function AddFeatureDialog() {
  const [open, setOpen] = React.useState(false);
  const { user } = useSupabaseAuth();
  
  // Check if current user is the admin (debruijneb@gmail.com)
  const isAdmin = user?.email === "debruijneb@gmail.com";

  // If user is not admin, don't render the button at all
  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="pulse" className="fixed bottom-6 right-6 z-10">
          <Plus />
          Ajouter une fonctionnalité
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle fonctionnalité</DialogTitle>
          <DialogDescription>
            Remplissez ce formulaire pour ajouter une nouvelle fonctionnalité à la roadmap.
          </DialogDescription>
        </DialogHeader>
        <RoadmapFeatureForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
