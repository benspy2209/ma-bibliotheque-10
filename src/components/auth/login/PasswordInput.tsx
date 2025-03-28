
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordInputProps {
  password: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  onForgotPassword: (e: React.MouseEvent) => void;
}

export function PasswordInput({ 
  password, 
  onChange, 
  isLoading, 
  onForgotPassword 
}: PasswordInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="password-login">Mot de passe</Label>
      <Input
        id="password-login"
        type="password"
        value={password}
        onChange={(e) => onChange(e.target.value)}
        required
        placeholder="••••••••"
        disabled={isLoading}
        autoComplete="current-password"
      />
      <div className="text-right">
        <Button 
          type="button" 
          variant="link" 
          className="p-0 h-auto text-xs cursor-pointer" 
          onClick={onForgotPassword}
        >
          Mot de passe oublié ?
        </Button>
      </div>
    </div>
  );
}
