
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginTab } from './tabs/LoginTab';
import { SignupTab } from './tabs/SignupTab';
import { ResetPasswordForm } from './ResetPasswordForm';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

interface LoginFormProps {
  defaultTab?: 'login' | 'signup' | 'reset';
}

export function LoginForm({ defaultTab = 'login' }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { authMode, setAuthMode } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'reset'>(
    defaultTab === 'reset' ? 'reset' : authMode === 'reset' ? 'reset' : defaultTab
  );

  // Update activeTab whenever authMode changes
  useEffect(() => {
    console.log("LoginForm: authMode changed to", authMode);
    if (authMode === 'reset') {
      setActiveTab('reset');
      console.log("LoginForm: activeTab set to 'reset'");
    }
  }, [authMode]);

  const handleTabChange = (value: string) => {
    console.log("Tab change requested to:", value);
    setActiveTab(value as 'login' | 'signup' | 'reset');
    setAuthMode(value as 'login' | 'signup' | 'reset');
  };

  // Debug log to see the actual active tab value
  console.log("Current activeTab:", activeTab);
  console.log("Current authMode:", authMode);

  // If activeTab is 'reset', render the reset password form directly
  if (activeTab === 'reset') {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Réinitialisation de mot de passe</h3>
          <button 
            onClick={() => handleTabChange('login')} 
            className="text-sm text-blue-600 hover:underline"
          >
            Retour à la connexion
          </button>
        </div>
        <ResetPasswordForm />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2 mb-2">
          <TabsTrigger value="signup">Inscription</TabsTrigger>
          <TabsTrigger value="login">Connexion</TabsTrigger>
        </TabsList>
        
        {activeTab === 'login' && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Nouveau sur Bibliopulse ? Cliquez sur "Inscription" pour créer un compte.
            </AlertDescription>
          </Alert>
        )}
        
        <TabsContent value="login">
          <LoginTab 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
          />
        </TabsContent>
        
        <TabsContent value="signup">
          <SignupTab 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
