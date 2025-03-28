
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Contact | BiblioPulse</title>
        <meta name="description" content="Contactez-nous pour toute question ou suggestion concernant BiblioPulse" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
      
      <NavBar />
      
      <main className="flex-grow py-8 bg-black text-white w-full">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Contactez-nous</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              Vous avez une question, une suggestion ou un problème ? N'hésitez pas à nous contacter, nous sommes heureux de vous aider.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
            <Card className="border-none shadow-md hover:shadow-lg transition-all bg-zinc-900">
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-3">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">E-mail</h3>
                <a href="mailto:contact@bibliopulse.be" className="text-primary hover:underline text-sm md:text-base">
                  contact@bibliopulse.be
                </a>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md hover:shadow-lg transition-all bg-zinc-900">
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-3">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">GSM</h3>
                <a href="tel:+32497363065" className="text-primary hover:underline text-sm md:text-base">
                  +32 497 36 30 65
                </a>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md hover:shadow-lg transition-all bg-zinc-900 md:col-span-2 lg:col-span-1">
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-3">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">Adresse</h3>
                <p className="text-primary text-sm md:text-base">
                  1640 Rhode-Saint-Genèse<br />
                  Belgique
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
