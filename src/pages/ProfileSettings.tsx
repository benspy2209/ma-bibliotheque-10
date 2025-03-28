
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { UsernameForm } from '@/components/user/UsernameForm';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

const ProfileSettings = () => {
  const { user, isLoading } = useSupabaseAuth();
  const navigate = useNavigate();

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Paramètres du profil | BiblioPulse</title>
      </Helmet>
      
      <NavBar />
      
      <div className="container max-w-4xl mx-auto px-4 py-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Paramètres du profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et vos préférences.
          </p>
        </div>

        <div className="grid gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Nom d'utilisateur</h2>
            <UsernameForm />
          </div>
          
          {/* Additional profile sections can be added here */}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfileSettings;
