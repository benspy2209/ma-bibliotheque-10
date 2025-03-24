
import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  author: z.string().min(1, "L'auteur est requis"),
  language: z.string().default("fr"),
  description: z.string().optional(),
  numberOfPages: z.coerce.number().optional(),
  publishDate: z.string().optional(),
  isbn: z.string().optional(),
});

export type BookFormValues = z.infer<typeof bookSchema>;
