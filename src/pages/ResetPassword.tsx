
import { Helmet } from "react-helmet-async";
import NavBar from "@/components/NavBar";
import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(true);
  const { resetEmailError, hasRecoveryToken, checkForRecoveryToken } = useSupabaseAuth();
  
  useEffect(() => {
    // Check for recovery token when component mounts
    const hasToken = checkForRecoveryToken();
    console.log("Reset password page mounted, recovery token check:", hasToken);
    setIsLoading(false);
  }, [checkForRecoveryToken]);

  // Handle button click to open reset form
  const handleRetryReset = () => {
    window.location.href = '/reset-password';
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Réinitialisation du mot de passe | Bibliopulse</title>
      </Helmet>
      
      <NavBar />
      
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-md">
            {isLoading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  {hasRecoveryToken 
                    ? "Définir un nouveau mot de passe" 
                    : resetEmailError 
                      ? "Le lien a expiré" 
                      : "Réinitialisation du mot de passe"
                  }
                </h2>
                
                {resetEmailError && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {resetEmailError}
                      <div className="mt-2">
                        <Button 
                          onClick={handleRetryReset} 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                        >
                          Demander un nouveau lien
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                {hasRecoveryToken ? (
                  <>
                    <Alert className="mb-6 bg-blue-50 border-blue-200">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        Veuillez définir votre nouveau mot de passe ci-dessous.
                      </AlertDescription>
                    </Alert>
                    <UpdatePasswordForm />
                  </>
                ) : (
                  <ResetPasswordForm />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
