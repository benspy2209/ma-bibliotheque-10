
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

export const FeatureCallToAction = () => {
  const { signIn, user, setShowLoginDialog } = useSupabaseAuth();

  // Function to handle click on the login button
  const handleSignInClick = () => {
    console.log("Opening login dialog from Features page");
    setShowLoginDialog(true);
    signIn('signup');
  };

  return (
    <div className="mt-16 text-center bg-primary/5 py-16 px-6 rounded-lg">
      <h2 className="text-3xl font-bold mb-4">Prêt à organiser votre bibliothèque ?</h2>
      <p className="text-xl mb-8 max-w-3xl mx-auto">
        Commencez dès maintenant à profiter de toutes ces fonctionnalités et transformez votre expérience de lecture.
      </p>
      
      {!user && (
        <div className="flex justify-center">
          <div className="relative inline-block">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500/50 opacity-75"></span>
            <Button 
              size="lg" 
              onClick={handleSignInClick}
              className="relative z-10 font-semibold text-base transition-all duration-300 shadow-md hover:shadow-lg pulse-effect flex items-center gap-2"
            >
              <Heart className="h-5 w-5 fill-white" /> Commencez à créer votre bibliothèque !
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
