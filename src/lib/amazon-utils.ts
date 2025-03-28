
import { Book } from '@/types/book';

// ID d'affilié Amazon France
export const AMAZON_AFFILIATE_ID = 'bibliopulse22-21';

/**
 * Génère un lien d'affiliation Amazon correct pour un livre donné
 * Cette fonction améliorée gère mieux les ISBN et inclut toujours l'ID d'affilié
 */
export function getAmazonAffiliateUrl(book: Book) {
  if (!book) return `https://www.amazon.fr/?tag=${AMAZON_AFFILIATE_ID}`;
  
  // Si nous avons un ISBN, essayons de l'utiliser
  let asin = book.isbn || '';
  
  // Nettoyer l'ISBN - enlever les espaces, tirets, etc.
  asin = asin.replace(/[^0-9X]/gi, '');
  
  // Vérification valide pour ISBN-10 ou ISBN-13
  const isValidIsbn = (asin.length === 10 || asin.length === 13) && 
                      /^[0-9]{9}[0-9X]$|^978[0-9]{10}$|^979[0-9]{10}$/.test(asin);
  
  if (!isValidIsbn) {
    // Si l'ISBN est invalide, on utilise la recherche par titre et auteur
    const author = Array.isArray(book.author) ? book.author[0] || '' : (book.author || '');
    const searchQuery = encodeURIComponent(`${book.title} ${author}`);
    return `https://www.amazon.fr/s?k=${searchQuery}&i=stripbooks&tag=${AMAZON_AFFILIATE_ID}`;
  }
  
  // Convertir ISBN-13 en ASIN (ISBN-10) si c'est un ISBN-13 qui commence par 978
  if (asin.length === 13 && asin.startsWith('978')) {
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
      // En cas d'erreur, on garde l'ISBN-13
    }
  }

  // Générer le lien Amazon avec l'ASIN/ISBN
  if (asin && (asin.length === 10 || asin.length === 13)) {
    return `https://www.amazon.fr/dp/${asin}/?tag=${AMAZON_AFFILIATE_ID}`;
  } else {
    // Fallback: recherche par titre et auteur
    const author = Array.isArray(book.author) ? book.author[0] || '' : (book.author || '');
    const searchQuery = encodeURIComponent(`${book.title} ${author}`);
    return `https://www.amazon.fr/s?k=${searchQuery}&i=stripbooks&tag=${AMAZON_AFFILIATE_ID}`;
  }
}

/**
 * Vérifie si un lien Amazon est correct (contient l'ID d'affiliation)
 */
export function isAmazonLinkValid(url: string | undefined): boolean {
  if (!url) return false;
  
  // Vérifier si c'est un lien Amazon
  if (!url.includes('amazon.fr')) return false;
  
  // Vérifier si l'ID d'affilié est présent
  return url.includes(`tag=${AMAZON_AFFILIATE_ID}`);
}
