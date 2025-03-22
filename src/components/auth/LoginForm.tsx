
import { useState } from 'react';
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
  const { setAuthMode } = useSupabaseAuth();

  const handleTabChange = (value: string) => {
    setAuthMode(value as 'login' | 'signup' | 'reset');
  };

  return (
    <div className="w-full">
      <Tabs defaultValue={defaultTab} className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2 mb-2">
          <TabsTrigger value="login">Connexion</TabsTrigger>
          <TabsTrigger value="signup">Inscription</TabsTrigger>
        </TabsList>
        
        {defaultTab === 'signup' && defaultTab === 'login' && (
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

        <TabsContent value="reset">
          <ResetPasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
