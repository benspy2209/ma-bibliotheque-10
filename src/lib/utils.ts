
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

export function removeDuplicateBooks(books: Book[]): Book[] {
  const seen = new Set();
  
  return books.filter(book => {
    // Créer une clé unique basée sur le titre et le premier auteur
    const key = `${book.title.toLowerCase()}_${Array.isArray(book.author) ? book.author[0]?.toLowerCase() : book.author?.toLowerCase()}`;
    
    if (seen.has(key)) {
      return false;
    }
    
    seen.add(key);
    return true;
  });
}

// Liste étendue de mots-clés techniques pour le post-filtrage
const TECHNICAL_KEYWORDS = [
  'manuel', 'guide', 'prospection', 'minier', 'minière', 'géologie', 'scientifique',
  'technique', 'rapport', 'étude', 'ingénierie', 'document', 'actes', 'conférence',
  'colloque', 'symposium', 'proceedings', 'thèse', 'mémoire', 'doctorat',
  'dictionnaire', 'encyclopédie', 'lexique', 'glossaire', 'référence', 'répertoire',
  'catalogue', 'index', 'annuaire', 'bibliographie', 'revue', 'périodique', 'collection',
  'compilation', 'atlas', 'critique', 'édition critique', 'chronologie', 'chronique',
  'recueil', 'almanach', 'traité', 'précis', 'abrégé', 'compendium',
  'anthologie', 'mélanges', 'festschrift', 'correspondance', 'lettres', 'journal',
  'carnets', 'cahiers', 'notes', 'essais', 'études', 'leçons', 'cours', 'conférences',
  'méthode', 'guide pratique', 'manuel de', 'formation', 'graphologie', 'sevices', 'ssiap',
  'cuisine', 'bébé', 'comptines', 'éducation', 'organisation', 'transmettre'
];

// Mots-clés spécifiques aux types de livres non désirés - liste étendue
const UNWANTED_TYPES = [
  'dictionnaire', 'critiq', 'theolog', 'dogmat', 'canoni', 'universel', 'ecclesiasti',
  'sciences', 'geographi', 'chronologi', 'histori', 'encyclopédie', 'traité', 'manuel',
  'revue', 'journal', 'magazine', 'périodique', 'bulletin', 'lexique', 'répertoire',
  'compendium', 'abrégé', 'précis', 'actes', 'proceedings', 'études', 'annales',
  'méthode', 'guide pratique', 'cours de', 'formation', 'agents', 'securite', 'incendie',
  'graphologie', 'sevices', 'ssiap', 'cuisine', 'transmettre', 'comptines', 'vente'
];

export function filterNonBookResults(books: Book[]): Book[] {
  return books.filter(book => {
    if (!book.title) return false;
    
    const titleLower = book.title.toLowerCase();
    const authorString = Array.isArray(book.author) 
      ? book.author.join(' ').toLowerCase() 
      : (book.author || '').toLowerCase();
    const subjectsString = (book.subjects || []).join(' ').toLowerCase();
    const descriptionLower = (book.description || '').toLowerCase();
    
    const allText = `${titleLower} ${authorString} ${subjectsString} ${descriptionLower}`;
    
    // Exclure les livres qui contiennent des mots-clés techniques ou des types non désirés
    const containsTechnicalKeywords = TECHNICAL_KEYWORDS.some(keyword => 
      allText.includes(keyword.toLowerCase())
    );
    
    const containsUnwantedTypes = UNWANTED_TYPES.some(keyword => 
      titleLower.includes(keyword.toLowerCase())
    );
    
    // Exclure les livres dont le titre est trop générique ou suspect
    const isSuspiciousTitle = titleLower.startsWith('oeuvres de') || 
                              titleLower.startsWith('œuvres de') ||
                              titleLower.startsWith('oeuvres complètes') ||
                              titleLower.startsWith('œuvres complètes') ||
                              titleLower.includes('collection') ||
                              titleLower.includes('anthologie');
    
    return !containsTechnicalKeywords && !containsUnwantedTypes && !isSuspiciousTitle;
  });
}

export function isAuthorMatch(book: Book, searchQuery: string): boolean {
  if (!book.author || (Array.isArray(book.author) && book.author.length === 0)) {
    return false;
  }
  
  const searchTerms = searchQuery.toLowerCase().split(' ');
  const authors = Array.isArray(book.author) ? book.author : [book.author];
  
  // Pour chaque auteur dans le livre
  return authors.some(author => {
    if (!author) return false;
    const authorLower = author.toLowerCase();
    
    // 1. Vérification exacte (match parfait)
    if (authorLower === searchQuery.toLowerCase()) {
      return true;
    }
    
    // 2. Vérification que tous les termes de recherche sont présents dans l'auteur
    const allTermsPresent = searchTerms.every(term => authorLower.includes(term));
    
    // 3. Vérification plus stricte: les termes doivent être dans l'ordre
    // (pour éviter que "King Stephen" corresponde à "Stephen King")
    const searchPattern = searchTerms.join('.*');
    const regexOrder = new RegExp(searchPattern, 'i');
    const termsInOrder = regexOrder.test(authorLower);
    
    // Vérification que l'auteur n'est pas trop générique
    const isGenericAuthor = authorLower.includes('collectif') || 
                            authorLower.includes('divers') ||
                            authorLower.includes('various') ||
                            authorLower.includes('auteurs') ||
                            authorLower.includes('authors');
    
    // L'auteur correspond si tous les termes sont présents, dans le bon ordre, et que ce n'est pas un auteur générique
    return allTermsPresent && termsInOrder && !isGenericAuthor;
  });
}

// Nouvelle fonction pour vérifier si un livre correspond au titre recherché
export function isTitleMatch(book: Book, searchQuery: string): boolean {
  if (!book.title) return false;
  
  const searchLower = searchQuery.toLowerCase().trim();
  const titleLower = book.title.toLowerCase().trim();
  
  // Correspondance exacte du titre
  if (titleLower === searchLower) {
    return true;
  }
  
  // Vérifier si le titre contient tous les mots de la recherche
  const searchWords = searchLower.split(/\s+/).filter(word => word.length > 1);
  
  if (searchWords.length === 0) return false;
  
  const allWordsPresent = searchWords.every(word => titleLower.includes(word));
  
  // Vérifier si au moins 60% des mots de la recherche sont présents dans le titre
  const matchingWords = searchWords.filter(word => titleLower.includes(word));
  const matchingPercentage = (matchingWords.length / searchWords.length) * 100;
  
  // Vérifier si le titre commence par le terme de recherche
  const titleStartsWithSearch = titleLower.startsWith(searchLower);
  
  // Le livre correspond si le titre contient tous les mots de la recherche
  // ou si au moins 60% des mots de la recherche sont présents dans le titre
  // ou si le titre commence par le terme de recherche
  return allWordsPresent || matchingPercentage >= 60 || titleStartsWithSearch;
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
