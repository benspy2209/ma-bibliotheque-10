
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    const body = await req.text();
    console.log("Request body:", body);
    
    let data: ContactEmailRequest;
    try {
      data = JSON.parse(body);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Invalid JSON in request body");
    }
    
    const { name, email, subject, message } = data;

    // Validation des champs
    if (!name || !email || !subject || !message) {
      throw new Error("Tous les champs sont requis");
    }

    console.log("Sending admin email...");
    // Email à l'administrateur
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

    console.log("Sending user confirmation email...");
    // Email de confirmation à l'utilisateur
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

    console.log("Emails envoyés avec succès:", { adminEmail: adminEmailResponse, userEmail: userEmailResponse });

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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
