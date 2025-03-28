
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { Helmet } from "react-helmet-async";
import NavBar from "@/components/NavBar";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function ResetPassword() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  // Extraire les paramètres de l'URL au chargement de la page
  useEffect(() => {
    // Vérifier les paramètres dans le hash URL (format #token=xxx&type=recovery)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);
    
    // Récupérer les paramètres de différentes sources possibles
    const tokenFromHash = hashParams.get('token') || hashParams.get('access_token');
    const tokenFromQuery = queryParams.get('token');
    const emailFromHash = hashParams.get('email');
    const emailFromQuery = queryParams.get('email');
    const typeFromHash = hashParams.get('type');
    const typeFromQuery = queryParams.get('type');
    
    // Utiliser les paramètres trouvés
    setToken(tokenFromHash || tokenFromQuery);
    setEmail(emailFromHash || emailFromQuery);
    setType(typeFromHash || typeFromQuery);
    
    console.log("URL parameters:", {
      token: tokenFromHash || tokenFromQuery,
      email: emailFromHash || emailFromQuery,
      type: typeFromHash || typeFromQuery,
      hash: window.location.hash,
      query: window.location.search
    });
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
            {(token || type === 'recovery') ? (
              <>
                {email && (
                  <Alert className="mb-4 bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Vous pouvez maintenant définir un nouveau mot de passe pour {email}.
                    </AlertDescription>
                  </Alert>
                )}
                <UpdatePasswordForm 
                  hasRecoveryToken={true} 
                  tokenFromUrl={token}
                  emailFromUrl={email}
                />
              </>
            ) : (
              <UpdatePasswordForm hasRecoveryToken={false} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
