
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Réinitialiser l'erreur lorsque l'utilisateur modifie le formulaire
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log("Préparation de l'envoi des données:", formData);
      
      // Validation côté client
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        throw new Error("Tous les champs sont requis");
      }
      
      console.log("Envoi des données à la fonction Edge Supabase...");
      
      // Envoi du formulaire via la fonction Edge Supabase
      const { data, error: supabaseError } = await supabase.functions.invoke('send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)  // Explicitly stringify the data
      });

      if (supabaseError) {
        console.error("Erreur Supabase:", supabaseError);
        throw new Error(supabaseError.message || "Une erreur est survenue lors de l'envoi du message");
      }

      console.log("Réponse de la fonction Edge:", data);

      toast({
        title: "Message envoyé",
        description: "Nous avons bien reçu votre message et reviendrons vers vous rapidement.",
      });
      
      // Réinitialisation du formulaire après envoi réussi
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      console.error("Erreur lors de l'envoi du message:", error);
      setError(error.message || "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard.");
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Contact | BiblioPulse</title>
        <meta name="description" content="Contactez-nous pour toute question ou suggestion concernant BiblioPulse" />
      </Helmet>
      
      <NavBar />
      
      <main className="flex-grow py-12 bg-black text-white">
        <div className="container px-4 mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une question, une suggestion ou un problème ? N'hésitez pas à nous contacter, nous serons ravis de vous aider.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="border-none shadow-md hover:shadow-lg transition-all bg-zinc-900">
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Email</h3>
                <a href="mailto:contact@bibliopulse.be" className="text-primary hover:underline">
                  contact@bibliopulse.be
                </a>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md hover:shadow-lg transition-all bg-zinc-900">
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Téléphone</h3>
                <a href="tel:+32497363065" className="text-primary hover:underline">
                  +32 497 36 30 65
                </a>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md hover:shadow-lg transition-all bg-zinc-900">
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Adresse</h3>
                <p className="text-white">
                  Rhode-Saint-Genèse<br />
                  Belgique
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="max-w-2xl mx-auto bg-zinc-900 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-white">Formulaire de contact</h2>
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Nom</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Votre nom" 
                    required 
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="votre@email.com" 
                    required 
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-white">Sujet</Label>
                <Input 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  placeholder="Sujet de votre message" 
                  required 
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">Message</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  placeholder="Votre message" 
                  rows={6} 
                  required 
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                    Envoi en cours...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Envoyer le message
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
