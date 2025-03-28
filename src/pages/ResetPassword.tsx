
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Helmet } from "react-helmet-async";
import NavBar from "@/components/NavBar";
import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

export default function ResetPassword() {
  const [isValidResetLink, setIsValidResetLink] = useState<boolean | null>(null);
  const { resetEmailError } = useSupabaseAuth();

  useEffect(() => {
    // Check if this is a valid reset link by looking for the recovery token
    const hash = window.location.hash;
    const isRecovery = hash.includes('type=recovery') && !hash.includes('error=');
    
    // Set to true if this is a valid recovery link, false otherwise
    setIsValidResetLink(isRecovery);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Réinitialisation du mot de passe | Biblioapp</title>
      </Helmet>
      
      <NavBar />
      
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-md">
            {isValidResetLink === true ? (
              // Show the update password form for valid links
              <UpdatePasswordForm />
            ) : isValidResetLink === false || resetEmailError ? (
              // Show the reset password form for invalid links or errors
              <>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  {resetEmailError ? "Lien expiré" : "Réinitialisation du mot de passe"}
                </h2>
                <ResetPasswordForm />
              </>
            ) : (
              // Loading state
              <div className="text-center py-8">Chargement...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
