
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, AlertCircle, Info, Shield } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Schéma de validation pour le formulaire de réinitialisation de mot de passe
const passwordFormSchema = z.object({
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

// Schéma de validation pour le formulaire d'administration
const adminPasswordFormSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

interface UpdatePasswordFormProps {
  hasRecoveryToken?: boolean;
  tokenFromUrl?: string | null;
  emailFromUrl?: string | null;
}

export function UpdatePasswordForm({ hasRecoveryToken = false, tokenFromUrl = null, emailFromUrl = null }: UpdatePasswordFormProps) {
  const [email, setEmail] = useState(emailFromUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminDirectAction, setAdminDirectAction] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  
  // Formulaire pour le mode standard
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  // Formulaire pour le mode administrateur direct
  const adminForm = useForm<z.infer<typeof adminPasswordFormSchema>>({
    resolver: zodResolver(adminPasswordFormSchema),
    defaultValues: {
      email: email || "",
      password: "",
      confirmPassword: "",
    },
  });
  
  // Vérifier si l'utilisateur actuel est admin
  useEffect(() => {
    const checkIfAdmin = () => {
      if (user?.email === 'debruijneb@gmail.com') {
        setIsAdminMode(true);
      }
    };
    
    checkIfAdmin();
  }, [user]);

  // Méthode standard pour mettre à jour le mot de passe
  const onResetPassword = async (values: z.infer<typeof passwordFormSchema>) => {
    setError(null);
    setIsLoading(true);
    
    try {
      console.log("Réinitialisation du mot de passe avec les valeurs:", values);
      
      // Mettre à jour le mot de passe de l'utilisateur
      const { error: updateError } = await supabase.auth.updateUser({ 
        password: values.password 
      });
      
      if (updateError) {
        throw updateError;
      }
      
      setSuccess(true);
      toast({
        description: "Votre mot de passe a été mis à jour avec succès."
      });
      
      // Redirection après 3 secondes
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      setError(error.message || "Une erreur est survenue lors de la mise à jour du mot de passe.");
      toast({
        variant: "destructive",
        description: `Erreur : ${error.message || "Une erreur inattendue s'est produite."}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Méthode d'administration directe - réinitialiser le mot de passe d'un utilisateur
  const onAdminDirectReset = async (values: z.infer<typeof adminPasswordFormSchema>) => {
    console.log("Réinitialisation administrative directe pour:", values.email);
    setError(null);
    setIsLoading(true);
    
    try {
      console.log("Appel de la fonction edge admin-reset-password...");
      
      // Utiliser l'API Admin de Supabase pour réinitialiser directement le mot de passe
      const { data, error: functionError } = await supabase.functions.invoke('admin-reset-password', {
        body: { 
          email: values.email, 
          password: values.password 
        }
      });
      
      console.log("Réponse de la fonction edge:", data, "Erreur:", functionError);
      
      if (functionError) {
        console.error("Erreur de la fonction edge:", functionError);
        throw new Error(functionError.message || "Erreur lors de la réinitialisation du mot de passe");
      }
      
      if (data && data.error) {
        console.error("Erreur dans les données de la fonction edge:", data.error);
        throw new Error(data.error);
      }
      
      setSuccess(true);
      toast({
        description: `Le mot de passe de ${values.email} a été réinitialisé avec succès.`
      });
      
    } catch (error: any) {
      console.error("Erreur lors de la réinitialisation directe du mot de passe:", error);
      setError(error.message || "Une erreur est survenue lors de la réinitialisation du mot de passe.");
      toast({
        variant: "destructive",
        description: `Erreur : ${error.message || "Une erreur inattendue s'est produite."}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Méthode pour envoyer un email de réinitialisation
  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email) {
      setError("Veuillez saisir votre adresse email.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Envoi d'un email de réinitialisation à:", email);
      
      // Envoyer un email de réinitialisation
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (resetError) {
        if (resetError.message.includes("Invalid email")) {
          throw new Error("L'adresse email n'existe pas dans notre base de données.");
        } else if (resetError.message.includes("For security purposes")) {
          throw new Error("Pour des raisons de sécurité, veuillez attendre quelques secondes avant de réessayer.");
        } else {
          throw resetError;
        }
      }
      
      setSuccess(true);
      toast({
        description: "Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception et votre dossier SPAM."
      });
      
    } catch (error: any) {
      console.error("Erreur lors de l'envoi de l'email de réinitialisation:", error);
      setError(error.message || "Une erreur est survenue lors de l'envoi de l'email de réinitialisation.");
      toast({
        variant: "destructive",
        description: `Erreur : ${error.message || "Une erreur inattendue s'est produite."}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Réinitialisation du mot de passe</h2>
      
      {isAdminMode && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <Shield className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Mode administrateur activé. 
            {!adminDirectAction && (
              <Button 
                variant="link" 
                className="text-amber-800 font-medium underline p-0 ml-1 h-auto"
                onClick={() => setAdminDirectAction(true)}
              >
                Définir directement un mot de passe
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {isAdminMode && adminDirectAction && (
        <div className="mb-6">
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Vous pouvez définir directement un nouveau mot de passe pour un utilisateur.
            </AlertDescription>
          </Alert>
          
          <Form {...adminForm}>
            <form onSubmit={adminForm.handleSubmit(onAdminDirectReset)} className="space-y-4">
              <FormField
                control={adminForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email de l'utilisateur</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemple.com" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={adminForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nouveau mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={adminForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-1/2" 
                  disabled={isLoading}
                  onClick={() => setAdminDirectAction(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" className="w-1/2" disabled={isLoading}>
                  {isLoading ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
      
      {success ? (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            {adminDirectAction 
              ? "Le mot de passe a été réinitialisé avec succès."
              : hasRecoveryToken 
                ? "Votre mot de passe a été mis à jour avec succès. Vous allez être redirigé vers la page d'accueil..."
                : "Un email de réinitialisation a été envoyé à l'adresse indiquée. Veuillez vérifier votre boîte de réception et votre dossier spam."}
          </AlertDescription>
        </Alert>
      ) : (
        !adminDirectAction && (
          hasRecoveryToken ? (
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onResetPassword)} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {/* Email caché mais présent pour le traitement */}
                {email && <input type="hidden" value={email} />}
                
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nouveau mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmer le mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                </Button>
              </form>
            </Form>
          ) : (
            <form onSubmit={handleSendResetEmail} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Votre email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email@exemple.com"
                  disabled={isLoading}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Envoi en cours...' : 'Envoyer un lien de réinitialisation'}
              </Button>

              <Alert>
                <AlertDescription className="text-xs">
                  Un email de réinitialisation sera envoyé à l'adresse indiquée. Vérifiez bien votre dossier SPAM si vous ne trouvez pas l'email.
                </AlertDescription>
              </Alert>
            </form>
          )
        )
      )}
    </div>
  );
}
