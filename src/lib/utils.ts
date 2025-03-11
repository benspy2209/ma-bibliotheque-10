import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Book } from '@/types/book'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeDuplicateBooks(books: Book[]): Book[] {
  const seen = new Set();
  
  return books.filter(book => {
    // Créer une clé unique basée sur le titre et le premier auteur
    const key = `${book.title.toLowerCase()}_${Array.isArray(book.author) ? book.author[0].toLowerCase() : book.author.toLowerCase()}`;
    
    if (seen.has(key)) {
      return false;
    }
    
    seen.add(key);
    return true;
  });
}
