
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Book } from '@/types/book'

// Ajout de l'ID d'affilié Amazon France
export const AMAZON_AFFILIATE_ID = 'ben0113-21'; // ID d'affilié Amazon

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAmazonAffiliateUrl(book: Book) {
  const searchQuery = encodeURIComponent(`${book.title} ${Array.isArray(book.author) ? book.author[0] : book.author}`);
  return `https://www.amazon.fr/s?k=${searchQuery}&i=stripbooks&tag=${AMAZON_AFFILIATE_ID}`;
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
  
  const newBookKey = `${newBook.title.toLowerCase()}_${Array.isArray(newBook.author) ? newBook.author[0].toLowerCase() : newBook.author.toLowerCase()}`;
  
  return existingBooks.some(book => {
    if (!book || !book.title || !book.author) return false;
    
    const existingBookKey = `${book.title.toLowerCase()}_${Array.isArray(book.author) ? book.author[0].toLowerCase() : book.author.toLowerCase()}`;
    return existingBookKey === newBookKey && book.id !== newBook.id;
  });
}
