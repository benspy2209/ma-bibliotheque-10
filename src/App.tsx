
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import MainLayout from "./components/MainLayout";
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

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout><Homepage /></MainLayout>} />
            <Route path="/library" element={<MainLayout><Library /></MainLayout>} />
            <Route path="/search" element={<MainLayout><Index /></MainLayout>} />
            <Route path="/statistics" element={<MainLayout><Statistics /></MainLayout>} />
            <Route path="/book/:id" element={<MainLayout><BookPage /></MainLayout>} />
            <Route path="/reset-password" element={<MainLayout><ResetPassword /></MainLayout>} />
            <Route path="/privacy-policy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
            <Route path="/legal-notice" element={<MainLayout><LegalNotice /></MainLayout>} />
            <Route path="/features" element={<MainLayout><Features /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
