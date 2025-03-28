
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
import { useIsMobile } from "@/hooks/use-mobile";

export function AddFeatureDialog() {
  const [open, setOpen] = React.useState(false);
  const { user } = useSupabaseAuth();
  const isMobile = useIsMobile();
  
  // Check if current user is the admin (debruijneb@gmail.com)
  const isAdmin = user?.email === "debruijneb@gmail.com";

  // If user is not admin, don't render the button at all
  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="pulse" 
          className="fixed bottom-6 right-6 z-10 text-xs md:text-sm px-2 py-1 md:px-3 md:py-2 shadow-lg"
          style={{ maxWidth: isMobile ? 'calc(100vw - 3rem)' : 'auto' }}
        >
          <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="max-w-[95vw] w-full sm:max-w-[600px] p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()} // Prevent keyboard from opening on mobile
      >
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
