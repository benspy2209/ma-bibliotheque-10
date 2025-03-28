
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteAccountForm() {
  const { user, signOut } = useSupabaseAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const deleteAccount = async () => {
    if (!user) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Supprimer les livres de l'utilisateur
      const { error: booksError } = await supabase
        .from('books')
        .delete()
        .eq('user_id', user.id);

      if (booksError) {
        console.error('Error deleting user books:', booksError);
        setErrorMessage("Une erreur est survenue lors de la suppression des livres.");
        return;
      }

      // Supprimer les objectifs de lecture
      const { error: goalsError } = await supabase
        .from('reading_goals')
        .delete()
        .eq('user_id', user.id);

      if (goalsError) {
        console.error('Error deleting reading goals:', goalsError);
      }

      // Supprimer le profil utilisateur
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        console.error('Error deleting user profile:', profileError);
        setErrorMessage("Une erreur est survenue lors de la suppression du profil.");
        return;
      }

      // Supprimer le compte utilisateur
      const { error: userError } = await supabase.auth.admin.deleteUser(
        user.id
      );

      if (userError) {
        console.error('Error deleting user account:', userError);
        
        // Fallback: déconnexion simple si la suppression du compte échoue
        await signOut();
        navigate('/');
        
        toast({
          description: "Votre compte a été partiellement supprimé. Contactez l'administrateur pour finaliser la suppression.",
          variant: "destructive"
        });
        
        return;
      }

      // Déconnexion et redirection vers la page d'accueil
      await signOut();
      navigate('/');
      
      toast({
        description: "Votre compte et toutes vos données ont été supprimés avec succès.",
      });
    } catch (error) {
      console.error('Error in deleteAccount:', error);
      setErrorMessage("Une erreur est survenue lors de la suppression du compte.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-red-500">Suppression du compte</CardTitle>
        <CardDescription>
          Supprimez définitivement votre compte et toutes vos données.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Attention ! Cette action est irréversible. Toutes vos données, y compris votre bibliothèque et vos statistiques, seront définitivement supprimées.
            </AlertDescription>
          </Alert>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="w-full"
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isSubmitting ? "Suppression en cours..." : "Supprimer mon compte"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Cela supprimera définitivement votre compte et toutes les données associées de nos serveurs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={deleteAccount} className="bg-red-500 hover:bg-red-600">
                  Oui, supprimer mon compte
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
