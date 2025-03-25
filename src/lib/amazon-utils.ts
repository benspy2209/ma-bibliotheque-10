
import { Book } from '@/types/book';

// ID d'affilié Amazon France
export const AMAZON_AFFILIATE_ID = 'bibliopulse22-21';

export function getAmazonAffiliateUrl(book: Book) {
  // Supprimer le préfixe '9' pour les ISBNs à 13 chiffres qui commence par 978 ou 979
  // Amazon utilise souvent l'ASIN qui est équivalent à l'ISBN-10
  let asin = book.isbn || '';
  
  // Convertir ISBN-13 en ASIN (ISBN-10) si c'est un ISBN-13 qui commence par 978
  if (asin.startsWith('978') && asin.length === 13) {
    asin = asin.substring(3, 12);
    
    // Calcul de la clé de contrôle pour ISBN-10
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(asin.charAt(i)) * (10 - i);
    }
    let checkDigit: string | number = 11 - (sum % 11);
    if (checkDigit === 10) checkDigit = 'X';
    else if (checkDigit === 11) checkDigit = 0;
    
    asin = asin + checkDigit;
  } 
  // Pour les ISBN qui ne commencent pas par 978 ou si la conversion échoue, utiliser l'ISBN complet
  
  if (asin && asin.length >= 10) {
    return `https://www.amazon.fr/dp/${asin}/?tag=${AMAZON_AFFILIATE_ID}`;
  } else {
    // Fallback: recherche par titre et auteur si ISBN non disponible ou invalide
    const searchQuery = encodeURIComponent(`${book.title} ${Array.isArray(book.author) ? book.author[0] : book.author}`);
    return `https://www.amazon.fr/s?k=${searchQuery}&i=stripbooks&tag=${AMAZON_AFFILIATE_ID}`;
  }
}
