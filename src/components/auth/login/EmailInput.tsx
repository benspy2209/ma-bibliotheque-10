
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailInputProps {
  email: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

export function EmailInput({ email, onChange, isLoading }: EmailInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="email-login">Email</Label>
      <Input
        id="email-login"
        type="email"
        value={email}
        onChange={(e) => onChange(e.target.value)}
        required
        placeholder="votre@email.com"
        disabled={isLoading}
        autoComplete="email"
      />
    </div>
  );
}
