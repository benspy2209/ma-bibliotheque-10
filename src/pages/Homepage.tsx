
import React from 'react';
import { HeroSection } from '@/components/homepage/HeroSection';
import { FeaturesSection } from '@/components/homepage/FeaturesSection';
import { BenefitsSection } from '@/components/homepage/BenefitsSection';
import { TestimonialsSection } from '@/components/homepage/TestimonialsSection';
import { CallToAction } from '@/components/homepage/CallToAction';

const Homepage = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <CallToAction />
    </>
  );
};

export default Homepage;
