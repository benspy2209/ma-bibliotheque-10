
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { OnboardingProvider } from '@/providers/OnboardingProvider';
import { useOnboardingContext } from '@/providers/OnboardingProvider';
import { WelcomeDialog } from '@/components/onboarding/WelcomeDialog';
import { TutorialTour } from '@/components/onboarding/TutorialTour';
import Homepage from "./pages/Homepage";
import Index from "./pages/Index";
import Library from "./pages/Library";
import Statistics from "./pages/Statistics";
import BookPage from "./pages/BookPage";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LegalNotice from "./pages/LegalNotice";
import Features from "./pages/Features";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, isLoading } = useSupabaseAuth();
  const { hasSeenTutorial } = useOnboardingContext();
  const [showWelcome, setShowWelcome] = useState(false);

  // Afficher la boîte de dialogue de bienvenue pour les utilisateurs connectés qui n'ont pas encore vu le tutoriel
  useEffect(() => {
    if (!isLoading && user && hasSeenTutorial === false) {
      // Délai court pour éviter que la boîte de dialogue ne s'affiche avant que la page soit complètement chargée
      const timer = setTimeout(() => {
        setShowWelcome(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, hasSeenTutorial]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/library" element={<Library />} />
        <Route path="/search" element={<Index />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/book/:id" element={<BookPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/legal-notice" element={<LegalNotice />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {user && (
        <>
          <WelcomeDialog open={showWelcome} onOpenChange={setShowWelcome} />
          <TutorialTour />
        </>
      )}
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <OnboardingProvider>
            <AppContent />
          </OnboardingProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
