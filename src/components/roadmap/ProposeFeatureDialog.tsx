
import React from "react";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProposeFeatureForm } from "./ProposeFeatureForm";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

export function ProposeFeatureDialog() {
  const [open, setOpen] = React.useState(false);
  const { user } = useSupabaseAuth();
  
  // Only show for logged-in users
  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 left-6 z-10">
          <MessageSquarePlus className="mr-2" />
          Proposer une fonctionnalité
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Proposer une nouvelle fonctionnalité</DialogTitle>
          <DialogDescription>
            Votre proposition sera examinée par l'équipe. Merci pour votre contribution !
          </DialogDescription>
        </DialogHeader>
        <ProposeFeatureForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
