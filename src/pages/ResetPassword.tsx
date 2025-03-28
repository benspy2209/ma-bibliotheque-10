
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { Helmet } from "react-helmet-async";
import NavBar from "@/components/NavBar";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract parameters from the URL when the page loads
  useEffect(() => {
    // Function to parse parameters from different URL formats
    const parseParams = () => {
      // Try to get params from hash, query, or pathname
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);
      
      // Check if token is in URL path (e.g., from external redirects)
      const pathMatch = window.location.pathname.match(/\/reset-password\/([^\/]+)/);
      const tokenFromPath = pathMatch ? pathMatch[1] : null;
      
      // Get token from different possible sources
      const tokenFromHash = hashParams.get('token') || hashParams.get('access_token');
      const tokenFromQuery = queryParams.get('token');
      
      // Get email from different possible sources
      const emailFromHash = hashParams.get('email');
      const emailFromQuery = queryParams.get('email');
      
      // Get type from different possible sources
      const typeFromHash = hashParams.get('type');
      const typeFromQuery = queryParams.get('type');
      
      // Set the values found
      setToken(tokenFromPath || tokenFromHash || tokenFromQuery);
      setEmail(emailFromHash || emailFromQuery);
      setType(typeFromHash || typeFromQuery || 'recovery'); // Default to recovery type
      
      console.log("URL parameters parsed:", {
        token: tokenFromPath || tokenFromHash || tokenFromQuery,
        email: emailFromHash || emailFromQuery,
        type: typeFromHash || typeFromQuery,
        hash: window.location.hash,
        query: window.location.search,
        path: window.location.pathname
      });
    };
    
    // Check if we're redirected from Supabase auth endpoint
    const isExternalRedirect = document.referrer.includes('api.bibliopulse.com/auth') || 
                              document.referrer.includes('kbmnsxakgyokifzoiajo.supabase.co');
    
    // If this is an initial load after redirect from Supabase,
    // and there's no token in our URL, check for it in sessionStorage
    // where Supabase might have stored it
    if (isExternalRedirect) {
      console.log("Detected redirect from Supabase auth endpoint");
      
      // If token is in the URL path as a separate segment, format it correctly
      if (location.pathname.includes('/reset-password/') && !location.search.includes('token=')) {
        const pathToken = location.pathname.split('/reset-password/')[1];
        if (pathToken) {
          console.log("Found token in path:", pathToken);
          navigate(`/reset-password?token=${pathToken}&type=recovery`, { replace: true });
          return;
        }
      }
    }
    
    parseParams();
  }, [location, navigate]);

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
