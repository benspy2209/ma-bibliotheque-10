
import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Link } from "react-router-dom";

export const FeatureCallToAction = () => {
  const { user } = useSupabaseAuth();

  return (
    <div className="mt-16 text-center bg-primary/5 py-16 px-6 rounded-lg">
      <h2 className="text-3xl font-bold mb-4">Prêt à organiser votre bibliothèque ?</h2>
      <p className="text-xl mb-8 max-w-3xl mx-auto">
        Commencez dès maintenant à profiter de toutes ces fonctionnalités et transformez votre expérience de lecture.
      </p>
      
      {!user && (
        <div className="flex justify-center">
          <Button 
            size="lg" 
            variant="pulse"
            className="relative z-10 font-semibold text-base transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
            asChild
          >
            <Link to="/library"><LogIn className="h-5 w-5" /> Commencer l'aventure</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
