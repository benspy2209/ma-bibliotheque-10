
import { Helmet } from "react-helmet-async";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Politique de confidentialité | Ma Bibliothèque</title>
      </Helmet>
      
      <NavBar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground italic">
              Le contenu de cette page sera mis à jour prochainement.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
