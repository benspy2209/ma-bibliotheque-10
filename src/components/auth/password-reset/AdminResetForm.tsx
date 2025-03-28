
import { useState } from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Schéma de validation pour le formulaire d'administration
const adminPasswordFormSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

interface AdminResetFormProps {
  initialEmail?: string;
  onCancel: () => void;
}

export function AdminResetForm({ initialEmail = '', onCancel }: AdminResetFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  
  // Formulaire pour le mode administrateur direct
  const adminForm = useForm<z.infer<typeof adminPasswordFormSchema>>({
    resolver: zodResolver(adminPasswordFormSchema),
    defaultValues: {
      email: initialEmail,
      password: "",
      confirmPassword: "",
    },
  });

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

  if (success) {
    return (
      <Alert className="mb-4 bg-green-50 border-green-200">
        <Info className="h-4 w-4 text-green-600" />
        <AlertDescription>
          Le mot de passe a été réinitialisé avec succès.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mb-6">
      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Vous pouvez définir directement un nouveau mot de passe pour un utilisateur.
        </AlertDescription>
      </Alert>
      
      <Form {...adminForm}>
        <form onSubmit={adminForm.handleSubmit(onAdminDirectReset)} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
              onClick={onCancel}
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
  );
}
