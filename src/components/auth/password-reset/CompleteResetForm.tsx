
import { useState } from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
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

interface CompleteResetFormProps {
  email: string | null;
}

export function CompleteResetForm({ email }: CompleteResetFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Formulaire pour le mode standard
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
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

  if (success) {
    return (
      <Alert className="mb-4 bg-green-50 border-green-200">
        <AlertDescription>
          Votre mot de passe a été mis à jour avec succès. Vous allez être redirigé vers la page d'accueil...
        </AlertDescription>
      </Alert>
    );
  }

  return (
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
  );
}
