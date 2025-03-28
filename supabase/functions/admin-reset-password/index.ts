
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

console.log("Admin reset password function loaded!");

serve(async (req) => {
  console.log("Received request to reset password");
  
  // Gérer les requêtes préliminaires CORS
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Récupération des variables d'environnement
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    console.log("Supabase URL available:", !!supabaseUrl);
    console.log("Supabase Service Key available:", !!supabaseServiceKey);

    // Vérification des variables d'environnement
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Variables d'environnement manquantes");
      throw new Error("Configuration incorrecte du serveur - SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant");
    }

    // Création du client Supabase avec la clé service_role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extraction des données de la requête
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data parsed successfully:", JSON.stringify(requestData));
    } catch (error) {
      console.error("Error parsing request body:", error);
      throw new Error("Format de requête invalide");
    }
    
    const { email, password }: AdminResetPasswordRequest = requestData;

    // Vérification des données obligatoires
    if (!email || !password) {
      console.error("Missing required fields:", { email: !!email, password: !!password });
      throw new Error("L'email et le mot de passe sont requis");
    }

    // Vérification que le mot de passe respecte les critères de sécurité minimaux
    if (password.length < 6) {
      console.error("Password too short");
      throw new Error("Le mot de passe doit contenir au moins 6 caractères");
    }

    console.log(`Tentative de réinitialisation du mot de passe pour l'utilisateur: ${email}`);

    // Rechercher l'utilisateur directement via l'API d'authentification
    const { data: authUsers, error: listUsersError } = await supabase.auth.admin.listUsers({
      perPage: 1000, // Augmenter si nécessaire pour trouver l'utilisateur
    });
    
    if (listUsersError) {
      console.error("Error listing users:", listUsersError);
      throw new Error("Erreur lors de la récupération des utilisateurs");
    }
    
    // Trouver l'utilisateur par son email
    const user = authUsers.users.find(u => u.email === email);
    
    if (!user) {
      console.error(`Utilisateur avec l'email ${email} non trouvé`);
      throw new Error(`Utilisateur avec l'email ${email} non trouvé`);
    }
    
    console.log(`Utilisateur trouvé avec l'ID: ${user.id}`);
    
    // Mise à jour du mot de passe de l'utilisateur
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
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
