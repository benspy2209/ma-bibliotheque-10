
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
    // Reset error when user modifies the form
    if (error) setError('');
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.name.trim()) errors.push("Name is required");
    if (!formData.email.trim()) errors.push("Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.push("Please enter a valid email address");
    if (!formData.subject.trim()) errors.push("Subject is required");
    if (!formData.message.trim()) errors.push("Message is required");
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '));
      toast({
        title: "Validation Error",
        description: validationErrors.join('. '),
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log("Preparing to send data:", formData);
      
      // Call the Edge Function with proper headers
      const { data, error: supabaseError } = await supabase.functions.invoke('send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: formData
      });

      if (supabaseError) {
        console.error("Supabase Error:", supabaseError);
        throw new Error(supabaseError.message || "An error occurred while sending the message");
      }

      console.log("Response from Edge Function:", data);

      toast({
        title: "Message Sent",
        description: "We have received your message and will get back to you shortly.",
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      console.error("Error sending message:", error);
      setError(error.message || "An error occurred while sending the message. Please try again later.");
      toast({
        title: "Error",
        description: error.message || "An error occurred while sending the message. Please try again later.",
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
        <meta name="description" content="Contact us with any questions or suggestions about BiblioPulse" />
      </Helmet>
      
      <NavBar />
      
      <main className="flex-grow py-12 bg-black text-white">
        <div className="container px-4 mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have a question, suggestion, or issue? Don't hesitate to contact us, we're happy to help.
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
                <h3 className="text-xl font-semibold mb-2 text-white">Phone</h3>
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
                <h3 className="text-xl font-semibold mb-2 text-white">Address</h3>
                <p className="text-white">
                  Rhode-Saint-Genèse<br />
                  Belgium
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="max-w-2xl mx-auto bg-zinc-900 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-white">Contact Form</h2>
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Your name" 
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
                    placeholder="your@email.com" 
                    required 
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-white">Subject</Label>
                <Input 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  placeholder="Subject of your message" 
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
                  placeholder="Your message" 
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
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send Message
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
