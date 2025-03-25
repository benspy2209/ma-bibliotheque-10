
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-contact-email");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the RESEND_API_KEY from environment
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set in environment variables");
      throw new Error("RESEND_API_KEY is not configured");
    }
    
    // Initialize Resend with the API key
    const resend = new Resend(apiKey);
    
    const contentType = req.headers.get("content-type") || "";
    console.log("Content-Type:", contentType);
    
    let data: ContactEmailRequest;
    
    if (contentType.includes("application/json")) {
      try {
        data = await req.json();
        console.log("Successfully parsed JSON:", data);
      } catch (parseError) {
        console.error("Error parsing JSON from request body:", parseError);
        return new Response(
          JSON.stringify({ error: "Invalid JSON format" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    } else {
      try {
        const body = await req.text();
        console.log("Request body (text):", body);
        try {
          data = JSON.parse(body);
          console.log("Successfully parsed JSON from text body:", data);
        } catch (error) {
          console.error("Error parsing JSON from text body:", error);
          return new Response(
            JSON.stringify({ error: "Invalid JSON in request body" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
      } catch (textError) {
        console.error("Error getting text from request body:", textError);
        return new Response(
          JSON.stringify({ error: "Could not read request body" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    }
    
    console.log("Parsed data:", data);
    
    const { name, email, subject, message } = data;

    // Validation des champs
    if (!name || !email || !subject || !message) {
      const missingFields = [];
      if (!name) missingFields.push("name");
      if (!email) missingFields.push("email");
      if (!subject) missingFields.push("subject");
      if (!message) missingFields.push("message");
      
      console.error("Missing required fields:", missingFields);
      return new Response(
        JSON.stringify({ error: "Tous les champs sont requis", missingFields }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Sending admin email...");
    // Email à l'administrateur
    try {
      const adminEmailResponse = await resend.emails.send({
        from: "BiblioPulse <contact@bibliopulse.be>",
        to: ["contact@bibliopulse.be"],
        subject: `Nouveau message: ${subject}`,
        html: `
          <h1>Nouveau message de contact</h1>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Sujet:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        `,
      });
      console.log("Admin email response:", adminEmailResponse);
    } catch (emailError) {
      console.error("Error sending admin email:", emailError);
      throw new Error(`Erreur lors de l'envoi de l'email administrateur: ${emailError.message}`);
    }

    console.log("Sending user confirmation email...");
    // Email de confirmation à l'utilisateur
    try {
      const userEmailResponse = await resend.emails.send({
        from: "BiblioPulse <contact@bibliopulse.be>",
        to: [email],
        subject: "Nous avons bien reçu votre message",
        html: `
          <h1>Merci de nous avoir contactés, ${name}!</h1>
          <p>Nous avons bien reçu votre message concernant "${subject}" et nous reviendrons vers vous dès que possible.</p>
          <p>Rappel de votre message:</p>
          <p>${message.replace(/\n/g, '<br/>')}</p>
          <p>Cordialement,<br>L'équipe BiblioPulse</p>
        `,
      });
      console.log("User email response:", userEmailResponse);
    } catch (emailError) {
      console.error("Error sending user confirmation email:", emailError);
      throw new Error(`Erreur lors de l'envoi de l'email de confirmation: ${emailError.message}`);
    }

    console.log("Emails envoyés avec succès");

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Erreur dans la fonction send-contact-email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Une erreur inconnue s'est produite" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
