
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
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <NavBar />
        
        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight text-center">
              Fonctionnalités de Bibliopulse
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-center mb-8">
              Découvrez tout ce que Bibliopulse peut faire pour transformer votre expérience de lecture et la gestion de votre bibliothèque personnelle.
            </p>
            
            {/* Statistiques ajoutées */}
            <div className="flex justify-center space-x-8 mb-16">
              <div className="text-center">
                <div className="font-bold text-3xl sm:text-4xl text-primary mb-1">44 624 261</div>
                <div className="text-muted-foreground">livres dans notre base</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-3xl sm:text-4xl text-primary mb-1">12 839 586</div>
                <div className="text-muted-foreground">auteurs référencés</div>
              </div>
            </div>

            <FeaturesTabs featureSections={featureSections} />

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
