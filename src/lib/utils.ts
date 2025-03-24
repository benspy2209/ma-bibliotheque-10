
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Book } from '@/types/book'

// ID d'affilié Amazon France mis à jour
export const AMAZON_AFFILIATE_ID = 'bibliopulse22-21';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAmazonAffiliateUrl(book: Book) {
  // Utilisation du format direct avec ISBN si disponible, sinon recherche par titre/auteur
  if (book.isbn) {
    return `https://www.amazon.fr/dp/${book.isbn}/?tag=${AMAZON_AFFILIATE_ID}`;
  } else {
    // Fallback: recherche par titre et auteur si ISBN non disponible
    const searchQuery = encodeURIComponent(`${book.title} ${Array.isArray(book.author) ? book.author[0] : book.author}`);
    return `https://www.amazon.fr/s?k=${searchQuery}&i=stripbooks&tag=${AMAZON_AFFILIATE_ID}`;
  }
}

// Fonction pour valider un ISBN (ISBN-10 ou ISBN-13)
export function isValidISBN(isbn: string): boolean {
  // Nettoyer l'entrée (supprimer les tirets et espaces)
  const cleanISBN = isbn.replace(/[-\s]/g, '');
  
  // Vérifier si c'est un ISBN-10 (10 chiffres)
  if (cleanISBN.length === 10) {
    // Vérification du checksum ISBN-10
    const sum = cleanISBN
      .split('')
      .slice(0, 9)
      .reduce((acc, digit, index) => {
        return acc + (Number(digit) * (10 - index));
      }, 0);
    
    // Le dernier chiffre peut être 'X' (représentant 10)
    const lastChar = cleanISBN.charAt(9);
    const lastDigit = lastChar === 'X' || lastChar === 'x' ? 10 : Number(lastChar);
    return (sum + lastDigit) % 11 === 0;
  }
  
  // Vérifier si c'est un ISBN-13 (13 chiffres)
  else if (cleanISBN.length === 13) {
    // Vérification du checksum ISBN-13
    const sum = cleanISBN
      .split('')
      .slice(0, 12)
      .reduce((acc, digit, index) => {
        // Dans ISBN-13, on alterne les poids 1 et 3
        const weight = index % 2 === 0 ? 1 : 3;
        return acc + (Number(digit) * weight);
      }, 0);
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return Number(cleanISBN.charAt(12)) === checkDigit;
  }
  
  // Si ce n'est ni un ISBN-10 ni un ISBN-13
  return false;
}

// Fonction pour déterminer si une chaîne ressemble à un ISBN
export function looksLikeISBN(input: string): boolean {
  // Nettoyer l'entrée (supprimer les tirets et espaces)
  const cleanInput = input.replace(/[-\s]/g, '');
  
  // Vérifier si la longueur correspond à un ISBN (10 ou 13 chiffres)
  if (cleanInput.length !== 10 && cleanInput.length !== 13) {
    return false;
  }
  
  // Pour ISBN-10, vérifier si tous les caractères sont des chiffres (sauf éventuellement le dernier qui peut être 'X')
  if (cleanInput.length === 10) {
    return /^[0-9]{9}[0-9X]$/i.test(cleanInput);
  }
  
  // Pour ISBN-13, vérifier si tous les caractères sont des chiffres
  if (cleanInput.length === 13) {
    return /^[0-9]{13}$/.test(cleanInput);
  }
  
  return false;
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

// Liste de mots-clés techniques pour le post-filtrage
const TECHNICAL_KEYWORDS = [
  'manuel', 'guide', 'prospection', 'minier', 'minière', 'géologie', 'scientifique',
  'technique', 'rapport', 'étude', 'ingénierie', 'document', 'actes', 'conférence',
  'colloque', 'symposium', 'proceedings', 'thèse', 'mémoire', 'doctorat'
];

export function filterNonBookResults(books: Book[]): Book[] {
  return books.filter(book => {
    // Vérifier si le titre contient des mots-clés techniques
    if (!book.title) return false;
    
    const titleLower = book.title.toLowerCase();
    const authorString = Array.isArray(book.author) 
      ? book.author.join(' ').toLowerCase() 
      : book.author.toLowerCase();
    const subjectsString = (book.subjects || []).join(' ').toLowerCase();
    const descriptionLower = (book.description || '').toLowerCase();
    
    const allText = `${titleLower} ${authorString} ${subjectsString} ${descriptionLower}`;
    
    // Exclure les livres qui contiennent des mots-clés techniques
    return !TECHNICAL_KEYWORDS.some(keyword => allText.includes(keyword.toLowerCase()));
  });
}

export function isAuthorMatch(book: Book, searchQuery: string): boolean {
  if (!book.author || (Array.isArray(book.author) && book.author.length === 0)) {
    return false;
  }
  
  const searchTerms = searchQuery.toLowerCase().split(' ');
  const authors = Array.isArray(book.author) ? book.author : [book.author];
  
  return authors.some(author => {
    if (!author) return false;
    const authorLower = author.toLowerCase();
    
    // Vérifie si le nom de l'auteur contient tous les termes de la recherche
    return searchTerms.every(term => authorLower.includes(term));
  });
}

export function isDuplicateBook(existingBooks: Book[], newBook: Book): boolean {
  if (!newBook || !newBook.title || !newBook.author) return false;
  
  // Création d'une clé unique pour le nouveau livre basée sur le titre et l'auteur (méthode normalisée)
  const newBookTitle = newBook.title.toLowerCase().trim();
  const newBookAuthor = Array.isArray(newBook.author) 
    ? newBook.author[0]?.toLowerCase().trim() 
    : newBook.author.toLowerCase().trim();
  
  if (!newBookAuthor) return false;
  
  // Vérifier parmi les livres existants
  return existingBooks.some(book => {
    // Ignorer la comparaison avec le même livre (même ID)
    if (book.id === newBook.id) return false;
    
    if (!book || !book.title || !book.author) return false;
    
    // Normaliser les données du livre existant
    const existingBookTitle = book.title.toLowerCase().trim();
    const existingBookAuthor = Array.isArray(book.author) 
      ? book.author[0]?.toLowerCase().trim() 
      : book.author.toLowerCase().trim();
    
    if (!existingBookAuthor) return false;
    
    // Comparer titre et auteur
    return existingBookTitle === newBookTitle && existingBookAuthor === newBookAuthor;
  });
}
