
import React from 'react';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { HeroSection } from '@/components/homepage/HeroSection';
import { FeaturesSection } from '@/components/homepage/FeaturesSection';
import { BenefitsSection } from '@/components/homepage/BenefitsSection';
import { TestimonialsSection } from '@/components/homepage/TestimonialsSection';
import { CallToAction } from '@/components/homepage/CallToAction';
import { Helmet } from "react-helmet-async";

const Homepage = () => {
  const { showLoginDialog, setShowLoginDialog } = useSupabaseAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>BiblioPulse | Votre bibliothèque personnelle, amplifiée</title>
        <meta
          name="description"
          content="Organisez, découvrez et partagez vos lectures préférées dans 7 langues différentes. BiblioPulse vous accompagne dans votre parcours littéraire."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Helmet>
      
      <NavBar />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <TestimonialsSection />
        <CallToAction />
      </main>

      <Footer />
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  );
};

export default Homepage;
