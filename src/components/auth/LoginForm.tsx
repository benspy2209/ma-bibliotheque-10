
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
  const { authMode, setAuthMode, signInWithGoogle, signInWithFacebook } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'reset'>(
    defaultTab === 'reset' ? 'reset' : authMode
  );

  // Update activeTab whenever authMode changes
  useEffect(() => {
    if (authMode === 'reset') {
      setActiveTab('reset');
    } else if (authMode === 'signup' || authMode === 'login') {
      setActiveTab(authMode);
    }
  }, [authMode]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'login' | 'signup' | 'reset');
    setAuthMode(value as 'login' | 'signup' | 'reset');
  };

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
      {/* Social login buttons section */}
      <div className="space-y-4 mb-6">
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
        
        <Button 
          onClick={signInWithFacebook}
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 py-6 border-2 border-[#1877F2] hover:bg-[#e7f0ff] dark:hover:bg-[#1e3a5f] transition-all"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z" fill="#1877F2"/>
            <path d="M16.6711 15.4688L17.2031 12H13.875V9.75C13.875 8.80102 14.34 7.875 15.8306 7.875H17.3438V4.92188C17.3438 4.92188 15.9705 4.6875 14.6576 4.6875C11.9166 4.6875 10.125 6.34875 10.125 9.35625V12H7.07812V15.4688H10.125V23.8542C11.3674 24.0486 12.6326 24.0486 13.875 23.8542V15.4688H16.6711Z" fill="white"/>
          </svg>
          <span className="text-lg font-medium text-[#1877F2]">Continuer avec Facebook</span>
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
            value="login"
            className={cn(
              "text-base py-3 border-b-2",
              activeTab === "login" 
                ? "border-primary font-semibold" 
                : "border-transparent text-muted-foreground"
            )}
          >
            Connexion
          </TabsTrigger>
          <TabsTrigger 
            value="signup"
            className={cn(
              "text-base py-3 border-b-2",
              activeTab === "signup" 
                ? "border-primary font-semibold" 
                : "border-transparent text-muted-foreground"
            )}
          >
            Inscription
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
