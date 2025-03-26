
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { showLoginDialog, setShowLoginDialog } = useSupabaseAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow">
        {children}
      </main>

      <Footer />
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  );
};

export default MainLayout;
