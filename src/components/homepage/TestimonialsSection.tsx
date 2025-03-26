
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type TestimonialProps = {
  content: string;
  author: string;
  role: string;
  avatarSrc?: string;
}

const testimonials: TestimonialProps[] = [
  {
    content: "BiblioPulse a révolutionné ma façon de gérer ma collection. Fini les listes sur papier ou les tableurs compliqués !",
    author: "Marie L.",
    role: "Enseignante",
    avatarSrc: "/photo 1.jpg"
  },
  {
    content: "J'ai enfin un système qui me permet de suivre mes lectures et de découvrir des livres qui correspondent vraiment à mes goûts.",
    author: "Thomas D.",
    role: "Étudiant en littérature",
    avatarSrc: "/photo 2.jpg"
  },
  {
    content: "L'interface est intuitive et les fonctionnalités de suivi de lecture sont exactement ce dont j'avais besoin pour organiser ma bibliothèque.",
    author: "Sophie M.",
    role: "Bibliothécaire",
  }
];

const TestimonialCard = ({ content, author, role, avatarSrc }: TestimonialProps) => (
  <Card className="border-none shadow-md">
    <CardContent className="pt-6 pb-6">
      <Badge variant="secondary" className="mb-4">Témoignage</Badge>
      <blockquote className="text-lg italic mb-6">
        "{content}"
      </blockquote>
      <div className="flex items-center gap-4">
        <Avatar>
          {avatarSrc ? (
            <AvatarImage src={avatarSrc} alt={author} />
          ) : null}
          <AvatarFallback>{author.split(' ').map(name => name[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
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

        {/* Affichage statique des témoignages au lieu du carrousel */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};
