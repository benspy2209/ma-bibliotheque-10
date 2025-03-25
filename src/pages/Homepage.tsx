
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

const Homepage = () => {
  const { showLoginDialog, setShowLoginDialog } = useSupabaseAuth();

  return (
    <div className="flex flex-col min-h-screen">
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
