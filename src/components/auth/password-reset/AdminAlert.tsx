
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

interface AdminAlertProps {
  onActivateAdminMode: () => void;
}

export function AdminAlert({ onActivateAdminMode }: AdminAlertProps) {
  return (
    <Alert className="mb-4 bg-amber-50 border-amber-200">
      <Shield className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        Mode administrateur activé. 
        <Button 
          variant="link" 
          className="text-amber-800 font-medium underline p-0 ml-1 h-auto"
          onClick={onActivateAdminMode}
        >
          Définir directement un mot de passe
        </Button>
      </AlertDescription>
    </Alert>
  );
}
