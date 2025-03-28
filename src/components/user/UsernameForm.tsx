
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, InfoIcon } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useUsername } from "@/hooks/use-username";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { useUserDisplay } from "@/components/navbar/UserUtils";
import { useTranslation } from "@/hooks/use-translation";

export function UsernameForm() {
  const { username, isLoading, canChangeUsername, nextChangeDate, updateUsername, isAdmin } = useUsername();
  const { user } = useSupabaseAuth();
  const { refreshUsername } = useUserDisplay(user);
  const [newUsername, setNewUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (username) {
      setNewUsername(username);
    }
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const success = await updateUsername(newUsername);
      if (success) {
        // Refresh the username display in the navbar
        refreshUsername();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatNextChangeDate = () => {
    if (!nextChangeDate) return "";
    return format(nextChangeDate, "dd MMMM yyyy", { locale: fr });
  };

  const isFirstTimeSettingUsername = username === null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {isFirstTimeSettingUsername 
            ? t("username_form.title") 
            : t("username_form.title_modify")}
        </CardTitle>
        <CardDescription>
          {isFirstTimeSettingUsername 
            ? t("username_form.subtitle") 
            : t("username_form.subtitle_modify")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isFirstTimeSettingUsername && !canChangeUsername && nextChangeDate && !isAdmin && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t("username_form.next_change")} {formatNextChangeDate()}.
            </AlertDescription>
          </Alert>
        )}

        {isAdmin && !isFirstTimeSettingUsername && (
          <Alert className="mb-4">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              En tant qu'administrateur, vous pouvez modifier votre nom d'utilisateur à tout moment.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="username">{t("username_form.label")}</Label>
            <Input
              id="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder={t("username_form.placeholder")}
              disabled={isLoading || isSubmitting || (!isFirstTimeSettingUsername && !canChangeUsername && !isAdmin)}
            />
          </div>

          <div className="mt-4 text-sm text-muted-foreground flex items-start gap-2">
            <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              {t("username_form.info")}
            </span>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-4"
            disabled={isLoading || isSubmitting || (!isFirstTimeSettingUsername && !canChangeUsername && !isAdmin) || newUsername === username}
          >
            {isSubmitting 
              ? t("username_form.submitting")
              : isFirstTimeSettingUsername 
                ? t("username_form.submit") 
                : t("username_form.submit_modify")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
