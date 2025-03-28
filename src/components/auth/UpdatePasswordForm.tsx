
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { StandardResetForm } from './password-reset/StandardResetForm';
import { CompleteResetForm } from './password-reset/CompleteResetForm';
import { AdminResetForm } from './password-reset/AdminResetForm';
import { AdminAlert } from './password-reset/AdminAlert';

interface UpdatePasswordFormProps {
  hasRecoveryToken?: boolean;
  tokenFromUrl?: string | null;
  emailFromUrl?: string | null;
}

export function UpdatePasswordForm({ 
  hasRecoveryToken = false, 
  tokenFromUrl = null, 
  emailFromUrl = null 
}: UpdatePasswordFormProps) {
  const [email, setEmail] = useState(emailFromUrl || '');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminDirectAction, setAdminDirectAction] = useState(false);
  const { user } = useSupabaseAuth();
  
  // Vérifier si l'utilisateur actuel est admin
  useEffect(() => {
    const checkIfAdmin = () => {
      if (user?.email === 'debruijneb@gmail.com') {
        setIsAdminMode(true);
      }
    };
    
    checkIfAdmin();
  }, [user]);

  // Active le mode admin direct
  const handleActivateAdminMode = () => {
    setAdminDirectAction(true);
  };

  // Désactive le mode admin direct
  const handleCancelAdminMode = () => {
    setAdminDirectAction(false);
  };

  if (adminDirectAction) {
    return (
      <AdminResetForm 
        initialEmail={email} 
        onCancel={handleCancelAdminMode} 
      />
    );
  }

  return (
    <div className="w-full max-w-md mx-auto py-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Réinitialisation du mot de passe</h2>
      
      {isAdminMode && !adminDirectAction && (
        <AdminAlert onActivateAdminMode={handleActivateAdminMode} />
      )}
      
      {hasRecoveryToken ? (
        <CompleteResetForm email={email} />
      ) : (
        <StandardResetForm email={email} setEmail={setEmail} />
      )}
    </div>
  );
}
