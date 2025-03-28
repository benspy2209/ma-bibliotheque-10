
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import ScrollToTop from "./components/ScrollToTop";
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
import FAQ from "./pages/FAQ";
import Roadmap from "./pages/Roadmap";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
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
            <Route path="/faq" element={<FAQ />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
