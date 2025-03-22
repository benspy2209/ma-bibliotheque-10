
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginTab } from './tabs/LoginTab';
import { SignupTab } from './tabs/SignupTab';
import { ResetPasswordForm } from './ResetPasswordForm';

interface LoginFormProps {
  defaultTab?: 'login' | 'signup';
}

export function LoginForm({ defaultTab = 'login' }: LoginFormProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset'>(defaultTab);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Tabs defaultValue={defaultTab} className="w-full" onValueChange={(value) => setAuthMode(value as 'login' | 'signup' | 'reset')}>
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="login">Connexion</TabsTrigger>
        <TabsTrigger value="signup">Inscription</TabsTrigger>
        <TabsTrigger value="reset">Mot de passe</TabsTrigger>
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

      <TabsContent value="reset">
        <ResetPasswordForm />
      </TabsContent>
    </Tabs>
  );
}
