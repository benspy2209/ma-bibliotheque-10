
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
        <Button variant="pulse" className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-10 text-sm md:text-base px-3 py-2">
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[600px] p-3 sm:p-6">
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
