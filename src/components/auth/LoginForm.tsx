
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginTab } from './tabs/LoginTab';
import { SignupTab } from './tabs/SignupTab';
import { ResetPasswordForm } from './ResetPasswordForm';
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";

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
      {/* Google sign-in button - Now featured prominently at the top */}
      <div className="mb-6">
        <Button 
          onClick={signInWithGoogle}
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 py-6 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
            </g>
          </svg>
          <span className="text-lg font-medium">Continuer avec Google</span>
        </Button>
      </div>

      <div className="relative my-6">
        <Separator className="my-4" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
          ou connexion avec email
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
