
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginTab } from './tabs/LoginTab';
import { SignupTab } from './tabs/SignupTab';
import { ResetPasswordForm } from './ResetPasswordForm';
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface LoginFormProps {
  defaultTab?: 'login' | 'signup' | 'reset';
}

export function LoginForm({ defaultTab = 'login' }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { authMode, setAuthMode, signInWithGoogle } = useSupabaseAuth();
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

  const handleGoogleSignIn = () => {
    console.log("Connexion avec Google initiée");
    signInWithGoogle();
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
      <div className="mb-6">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2 h-11"
          onClick={handleGoogleSignIn}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            <path d="M1 1h22v22H1z" fill="none"/>
          </svg>
          <span>Continuer avec Google</span>
        </Button>

        <div className="relative my-6">
          <Separator className="my-4" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
            ou continuer avec email
          </div>
        </div>
      </div>

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
