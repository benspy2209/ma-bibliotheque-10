
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { UsernameForm } from '@/components/user/UsernameForm';
import { ProfileForm } from '@/components/user/ProfileForm';
import { ReadingPreferencesForm } from '@/components/user/ReadingPreferencesForm';
import { InterfacePreferencesForm } from '@/components/user/InterfacePreferencesForm';
import { AccountSettingsForm } from '@/components/user/AccountSettingsForm';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { useTranslation } from '@/hooks/use-translation';

const ProfileSettings = () => {
  const { user, isLoading } = useSupabaseAuth();
  const { t } = useTranslation();
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
        <title>{t('profile_settings.title')} | BiblioPulse</title>
      </Helmet>
      
      <NavBar />
      
      <div className="container max-w-4xl mx-auto px-4 py-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('profile_settings.title')}</h1>
          <p className="text-muted-foreground">
            {t('profile_settings.subtitle')}
          </p>
        </div>

        <Tabs defaultValue="username" className="w-full">
          <TabsList className="mb-6 flex overflow-x-auto pb-px">
            <TabsTrigger value="username">{t('profile_settings.tab.username')}</TabsTrigger>
            <TabsTrigger value="personal-info">{t('profile_settings.tab.personal_info')}</TabsTrigger>
            <TabsTrigger value="reading">{t('profile_settings.tab.reading')}</TabsTrigger>
            <TabsTrigger value="interface">{t('profile_settings.tab.interface')}</TabsTrigger>
            <TabsTrigger value="account">{t('profile_settings.tab.account')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="username" className="py-2">
            <UsernameForm />
          </TabsContent>
          
          <TabsContent value="personal-info" className="py-2">
            <ProfileForm />
          </TabsContent>
          
          <TabsContent value="reading" className="py-2">
            <ReadingPreferencesForm />
          </TabsContent>
          
          <TabsContent value="interface" className="py-2">
            <InterfacePreferencesForm />
          </TabsContent>
          
          <TabsContent value="account" className="py-2">
            <AccountSettingsForm />
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfileSettings;
