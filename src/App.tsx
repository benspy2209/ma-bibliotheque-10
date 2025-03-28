import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

// Pages
import Homepage from './pages/Homepage';
import SearchPage from './pages/Index';
import BookPage from './pages/BookPage';
import Library from './pages/Library';
import Features from './pages/Features';
import Roadmap from './pages/Roadmap';
import Statistics from './pages/Statistics';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import LegalNotice from './pages/LegalNotice';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';

function App() {
  // État pour suivre si l'application est en cours de chargement initial
  // (utile pour éviter les transitions inutiles au premier rendu)
  const [isAppLoading, setIsAppLoading] = React.useState(true);

  React.useEffect(() => {
    // Simuler un temps de chargement initial (par exemple, vérification de l'authentification)
    const loadingTimeout = setTimeout(() => {
      setIsAppLoading(false);
    }, 500);

    return () => clearTimeout(loadingTimeout);
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <ScrollToTop />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/book/:bookId" element={<BookPage />} />
          <Route path="/library" element={<Library />} />
          <Route path="/features" element={<Features />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/legal-notice" element={<LegalNotice />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
