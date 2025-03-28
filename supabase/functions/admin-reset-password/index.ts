
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

// Configuration des en-têtes CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Interface pour la requête de réinitialisation de mot de passe
interface AdminResetPasswordRequest {
  email: string;
  password: string;
}

serve(async (req) => {
  // Gérer les requêtes préliminaires CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Récupération des variables d'environnement
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    // Vérification des variables d'environnement
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Variables d'environnement manquantes");
      throw new Error("Configuration incorrecte du serveur");
    }

    // Création du client Supabase avec la clé service_role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extraction des données de la requête
    const { email, password }: AdminResetPasswordRequest = await req.json();

    // Vérification des données obligatoires
    if (!email || !password) {
      throw new Error("L'email et le mot de passe sont requis");
    }

    // Vérification que le mot de passe respecte les critères de sécurité minimaux
    if (password.length < 6) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères");
    }

    console.log(`Tentative de réinitialisation du mot de passe pour l'utilisateur: ${email}`);

    // Identifier l'utilisateur par son email
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      console.error("Erreur lors de la recherche de l'utilisateur:", userError);
      throw new Error(`Utilisateur avec l'email ${email} non trouvé`);
    }

    // Mise à jour du mot de passe de l'utilisateur
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userData.id,
      { password: password }
    );

    if (updateError) {
      console.error("Erreur lors de la mise à jour du mot de passe:", updateError);
      throw updateError;
    }

    console.log(`Mot de passe réinitialisé avec succès pour l'utilisateur: ${email}`);

    // Réponse en cas de succès
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Mot de passe réinitialisé avec succès pour ${email}` 
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );

  } catch (error: any) {
    console.error("Erreur dans la fonction admin-reset-password:", error);
    
    // Réponse en cas d'erreur
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Une erreur est survenue" 
      }),
      { 
        status: 400, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  }
});
