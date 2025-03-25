
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

    // Validation of fields
    if (!name || !email || !subject || !message) {
      const missingFields = [];
      if (!name) missingFields.push("name");
      if (!email) missingFields.push("email");
      if (!subject) missingFields.push("subject");
      if (!message) missingFields.push("message");
      
      console.error("Missing required fields:", missingFields);
      return new Response(
        JSON.stringify({ error: "All fields are required", missingFields }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Sending admin email...");
    // Email to administrator
    try {
      const adminEmailResponse = await resend.emails.send({
        from: "BiblioPulse <contact@bibliopulse.be>",
        to: ["contact@bibliopulse.be"],
        subject: `New message: ${subject}`,
        html: `
          <h1>New contact message</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        `,
      });
      console.log("Admin email response:", adminEmailResponse);
    } catch (emailError) {
      console.error("Error sending admin email:", emailError);
      throw new Error(`Error sending admin email: ${emailError.message}`);
    }

    console.log("Sending user confirmation email...");
    // Confirmation email to user
    try {
      const userEmailResponse = await resend.emails.send({
        from: "BiblioPulse <contact@bibliopulse.be>",
        to: [email],
        subject: "We have received your message",
        html: `
          <h1>Thank you for contacting us, ${name}!</h1>
          <p>We have received your message about "${subject}" and we will get back to you as soon as possible.</p>
          <p>Your message:</p>
          <p>${message.replace(/\n/g, '<br/>')}</p>
          <p>Best regards,<br>The BiblioPulse Team</p>
        `,
      });
      console.log("User email response:", userEmailResponse);
    } catch (emailError) {
      console.error("Error sending user confirmation email:", emailError);
      throw new Error(`Error sending confirmation email: ${emailError.message}`);
    }

    console.log("Emails sent successfully");

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
