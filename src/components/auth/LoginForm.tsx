
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginTab } from './tabs/LoginTab';
import { SignupTab } from './tabs/SignupTab';
import { ResetPasswordForm } from './ResetPasswordForm';
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LoginFormProps {
  defaultTab?: 'login' | 'signup' | 'reset';
}

export function LoginForm({ defaultTab = 'login' }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { authMode, setAuthMode } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'reset'>(
    defaultTab === 'reset' ? 'reset' : authMode
  );

  // Update activeTab whenever authMode changes
  useEffect(() => {
    console.log("LoginForm: authMode changed to", authMode);
    if (authMode === 'reset') {
      setActiveTab('reset');
      console.log("LoginForm: activeTab set to 'reset'");
    } else if (authMode === 'signup' || authMode === 'login') {
      setActiveTab(authMode);
      console.log(`LoginForm: activeTab set to '${authMode}'`);
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
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger 
            value="signup"
            className={cn(
              "relative overflow-hidden text-base font-bold py-3 -mr-1 z-10 transform scale-110 shadow-xl rounded-l-lg rounded-r-none border-r-0",
              activeTab === "signup" 
                ? "bg-green-600 text-white hover:bg-green-700 glow-effect" 
                : "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 border-2 border-green-400 pulse-effect"
            )}
          >
            {activeTab !== "signup" && 
              <div className="absolute -right-6 -top-1 transform rotate-45 bg-green-500 text-xs px-8 py-1 text-white font-bold shadow-md">
                Nouveau
              </div>
            }
            INSCRIPTION
          </TabsTrigger>
          <TabsTrigger 
            value="login"
            className={cn(
              "z-0 rounded-l-none rounded-r-lg",
              activeTab === "login" 
                ? "font-medium bg-gray-200" 
                : "text-gray-600"
            )}
          >
            Connexion
          </TabsTrigger>
        </TabsList>
        
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
