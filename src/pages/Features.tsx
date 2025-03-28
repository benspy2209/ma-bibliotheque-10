
import { Helmet } from "react-helmet-async";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { FeaturesTabs } from "@/components/features/FeaturesTabs";
import { FeatureCallToAction } from "@/components/features/FeatureCallToAction";
import { featureSections } from "@/components/features/FeaturesData";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

const Features = () => {
  const { showLoginDialog, setShowLoginDialog } = useSupabaseAuth();

  return (
    <>
      <Helmet>
        <title>Fonctionnalités | Bibliopulse</title>
        <meta
          name="description"
          content="Découvrez toutes les fonctionnalités de Bibliopulse pour gérer votre bibliothèque personnelle."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <NavBar />
        
        <main className="flex-1 py-8 sm:py-12 px-3 sm:px-4 lg:px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight text-center">
              Fonctionnalités de Bibliopulse
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-center mb-10 sm:mb-16 px-2">
              Découvrez tout ce que Bibliopulse peut faire pour transformer votre expérience de lecture et la gestion de votre bibliothèque personnelle.
              <span className="block mt-2 text-xs sm:text-sm text-[#8E9196]">
                Recherchez dans notre base de <span className="font-medium text-primary/70">44 624 261 livres</span> et <span className="font-medium text-primary/70">12 839 586 auteurs</span> en français, anglais, néerlandais, espagnol, allemand, portugais et italien
              </span>
            </p>

            <div className="overflow-hidden">
              <FeaturesTabs featureSections={featureSections} />
            </div>

            <FeatureCallToAction />
          </div>
        </main>

        <Footer />
      </div>
      
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </>
  );
};

export default Features;
