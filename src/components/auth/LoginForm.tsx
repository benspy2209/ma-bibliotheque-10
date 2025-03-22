
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginTab } from './tabs/LoginTab';
import { SignupTab } from './tabs/SignupTab';
import { ResetPasswordForm } from './ResetPasswordForm';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface LoginFormProps {
  defaultTab?: 'login' | 'signup' | 'reset';
}

export function LoginForm({ defaultTab = 'login' }: LoginFormProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset'>(defaultTab);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-full">
      <Tabs defaultValue={defaultTab} className="w-full" onValueChange={(value) => setAuthMode(value as 'login' | 'signup' | 'reset')}>
        <TabsList className="grid w-full grid-cols-3 mb-2">
          <TabsTrigger value="login">Connexion</TabsTrigger>
          <TabsTrigger value="signup">Inscription</TabsTrigger>
          <TabsTrigger value="reset">Mot de passe</TabsTrigger>
        </TabsList>
        
        {defaultTab === 'signup' && authMode === 'login' && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Nouveau sur Biblioapp ? Cliquez sur "Inscription" pour créer un compte.
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
