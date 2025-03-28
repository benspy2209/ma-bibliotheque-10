
import { Book } from '@/types/book';

// ID d'affilié Amazon France
export const AMAZON_AFFILIATE_ID = 'bibliopulse22-21';

export function getAmazonAffiliateUrl(book: Book) {
  if (!book) return `https://www.amazon.fr/?tag=${AMAZON_AFFILIATE_ID}`;
  
  // Si nous avons un ISBN, essayons de l'utiliser
  let asin = book.isbn || '';
  
  // Si l'ISBN est vide ou invalide, on utilise la recherche par titre et auteur
  if (!asin || asin.length < 10) {
    // Recherche par titre et auteur
    const searchQuery = encodeURIComponent(`${book.title} ${Array.isArray(book.author) ? book.author[0] : book.author}`);
    return `https://www.amazon.fr/s?k=${searchQuery}&i=stripbooks&tag=${AMAZON_AFFILIATE_ID}`;
  }
  
  // Nettoyer l'ISBN - enlever les espaces, tirets, etc.
  asin = asin.replace(/[^0-9X]/gi, '');
  
  // Convertir ISBN-13 en ASIN (ISBN-10) si c'est un ISBN-13 qui commence par 978
  if (asin.startsWith('978') && asin.length >= 13) {
    try {
      // Extraire les 9 premiers chiffres après le préfixe 978
      const isbnCore = asin.substring(3, 12);
      
      // Calcul de la clé de contrôle pour ISBN-10
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(isbnCore.charAt(i)) * (10 - i);
      }
      
      let checkDigit: string | number = 11 - (sum % 11);
      if (checkDigit === 10) checkDigit = 'X';
      else if (checkDigit === 11) checkDigit = '0';
      
      asin = isbnCore + checkDigit;
    } catch (e) {
      console.error("Erreur lors de la conversion de l'ISBN-13 en ISBN-10:", e);
      // En cas d'erreur, conserver l'ISBN complet
    }
  }

  // Vérifier si l'ASIN semble valide (10 ou 13 caractères)
  if (asin && (asin.length === 10 || asin.length === 13)) {
    return `https://www.amazon.fr/dp/${asin}/?tag=${AMAZON_AFFILIATE_ID}`;
  } else {
    // Fallback: recherche par titre et auteur
    const searchQuery = encodeURIComponent(`${book.title} ${Array.isArray(book.author) ? book.author[0] : book.author}`);
    return `https://www.amazon.fr/s?k=${searchQuery}&i=stripbooks&tag=${AMAZON_AFFILIATE_ID}`;
  }
}
