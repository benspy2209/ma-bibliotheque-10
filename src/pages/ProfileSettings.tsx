
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { UserProfileForm } from '@/components/user/UserProfileForm';
import { UsernameForm } from '@/components/user/UsernameForm';
import { SocialLinksForm } from '@/components/user/SocialLinksForm';
import { ReadingPreferencesForm } from '@/components/user/ReadingPreferencesForm';
import { DisplaySettingsForm } from '@/components/user/DisplaySettingsForm';
import { ReadingGoalsSettingsForm } from '@/components/user/ReadingGoalsSettingsForm';
import { DeleteAccountForm } from '@/components/user/DeleteAccountForm';
import { BooksToBuyList } from '@/components/user/BooksToBuyList';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { ShoppingCart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const ProfileSettings = () => {
  const { user, isLoading } = useSupabaseAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'to-buy'; // Default to to-buy tab
  const isMobile = useIsMobile();

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Profil | BiblioPulse</title>
      </Helmet>
      
      <NavBar />
      
      <div className="container max-w-5xl mx-auto px-4 py-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et vos préférences.
          </p>
        </div>

        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className={`mb-8 h-auto ${isMobile ? 'flex-col w-full' : 'overflow-x-auto scrollbar-hide tabs-list-scroll'}`}>
            <TabsTrigger 
              value="to-buy"
              className="bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100 hover:bg-amber-200 dark:hover:bg-amber-700 data-[state=active]:bg-amber-500 data-[state=active]:text-white whitespace-nowrap"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              À acheter
            </TabsTrigger>
            <TabsTrigger value="profile" className="whitespace-nowrap">Profil</TabsTrigger>
            <TabsTrigger value="username" className="whitespace-nowrap">Nom d'utilisateur</TabsTrigger>
            <TabsTrigger value="social" className="whitespace-nowrap">Réseaux sociaux</TabsTrigger>
            <TabsTrigger value="reading" className="whitespace-nowrap">Préférences de lecture</TabsTrigger>
            <TabsTrigger value="display" className="whitespace-nowrap">Affichage</TabsTrigger>
            <TabsTrigger value="goals" className="whitespace-nowrap">Objectifs</TabsTrigger>
            <TabsTrigger value="account" className="whitespace-nowrap">Compte</TabsTrigger>
          </TabsList>
          
          <TabsContent value="to-buy" className="space-y-8">
            <BooksToBuyList />
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-8">
            <UserProfileForm />
          </TabsContent>
          
          <TabsContent value="username" className="space-y-8">
            <UsernameForm />
          </TabsContent>

          <TabsContent value="social" className="space-y-8">
            <SocialLinksForm />
          </TabsContent>
          
          <TabsContent value="reading" className="space-y-8">
            <ReadingPreferencesForm />
          </TabsContent>
          
          <TabsContent value="display" className="space-y-8">
            <DisplaySettingsForm />
          </TabsContent>
          
          <TabsContent value="goals" className="space-y-8">
            <ReadingGoalsSettingsForm />
          </TabsContent>

          <TabsContent value="account" className="space-y-8">
            <DeleteAccountForm />
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfileSettings;
