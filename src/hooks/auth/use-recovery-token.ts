
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook for handling password recovery tokens in URL
 */
export function useRecoveryToken() {
  const navigate = useNavigate();

  const checkForRecoveryToken = () => {
    // Check different URL patterns where token might be present
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);
    const pathname = window.location.pathname;
    
    // Check for token in various locations
    const hasRecoveryToken = 
      hash.includes('type=recovery') || 
      hash.includes('access_token') || 
      searchParams.has('token') ||
      searchParams.get('type') === 'recovery' ||
      pathname.includes('/reset-password/');
    
    if (hasRecoveryToken) {
      console.log("Password recovery token detected in URL");
      
      // If not already on reset password page, redirect there
      if (!pathname.startsWith('/reset-password')) {
        console.log("Redirecting to reset password page");
        
        // Extract token from path if present
        if (pathname.match(/\/verify\/[^\/]+/)) {
          const pathToken = pathname.split('/verify/')[1];
          navigate(`/reset-password?token=${pathToken}&type=recovery`);
        } else {
          navigate('/reset-password');
        }
      }
      return true;
    }
    return false;
  };

  useEffect(() => {
    checkForRecoveryToken();
  }, [navigate]);

  return { checkForRecoveryToken };
}
