
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type TestimonialProps = {
  content: string;
  author: string;
  role: string;
}

const testimonials: TestimonialProps[] = [
  {
    content: "BiblioPulse a révolutionné ma façon de gérer ma collection. Fini les listes sur papier ou les tableurs compliqués !",
    author: "Marie L.",
    role: "Enseignante"
  },
  {
    content: "J'ai enfin un système qui me permet de suivre mes lectures et de découvrir des livres qui correspondent vraiment à mes goûts.",
    author: "Thomas D.",
    role: "Étudiant en littérature"
  },
  {
    content: "L'interface est intuitive et les fonctionnalités de suivi de lecture sont exactement ce dont j'avais besoin pour organiser ma bibliothèque.",
    author: "Sophie M.",
    role: "Bibliothécaire"
  }
];

const TestimonialCard = ({ content, author, role }: TestimonialProps) => (
  <Card className="border-none shadow-md h-full">
    <CardContent className="pt-6 pb-6">
      <Badge variant="secondary" className="mb-4">Témoignage</Badge>
      <blockquote className="text-lg italic mb-6">
        "{content}"
      </blockquote>
      <div className="mt-4">
        <p className="font-medium">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </CardContent>
  </Card>
);

export const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ce que disent nos utilisateurs</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez ce que notre communauté de lecteurs pense de BiblioPulse
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex">
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
