
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
      </Helmet>
      
      <NavBar />
      
      <main className="flex-grow py-12 bg-black text-white">
        <div className="container px-4 mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Vous avez une question, une suggestion ou un problème ? N'hésitez pas à nous contacter, nous sommes heureux de vous aider.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="border-none shadow-md hover:shadow-lg transition-all bg-zinc-900">
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">E-mail</h3>
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
            
            <Card className="border-none shadow-md hover:shadow-lg transition-all bg-zinc-900 md:col-span-2 lg:col-span-1">
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Adresse</h3>
                <p className="text-primary">
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
