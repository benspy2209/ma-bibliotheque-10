
import { Book } from '@/types/book';

// Clé API ISBNDB
const ISBNDB_API_KEY = '60264_3de7f2f024bc350bfa823cbbd9e64315';
const ISBNDB_BASE_URL = 'https://api2.isbndb.com';

function cleanDescription(description: string): string {
  if (!description) return '';
  
  // Remplacer les balises <br> et <p> par des sauts de ligne
  let cleaned = description.replace(/<br\s*\/?>/gi, '\n');
  cleaned = cleaned.replace(/<p>/gi, '\n');
  cleaned = cleaned.replace(/<\/p>/gi, '\n');
  
  // Supprimer toutes les autres balises HTML
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Supprimer les caractères spéciaux et entités HTML
  cleaned = cleaned.replace(/&quot;/g, '"');
  cleaned = cleaned.replace(/&apos;/g, "'");
  cleaned = cleaned.replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  
  // Supprimer les sauts de ligne multiples
  cleaned = cleaned.replace(/\n\s*\n/g, '\n\n');
  
  // Supprimer les espaces en début et fin
  cleaned = cleaned.trim();

  return cleaned;
}

export async function getBookDetails(bookId: string): Promise<Partial<Book>> {
  console.log('[DETAIL] Récupération des détails pour le livre:', bookId);
  
  try {
    // Nettoyer l'ISBN des tirets éventuels
    const cleanedIsbn = bookId.replace(/-/g, '');
    
    // Vérifier si l'ID est un ISBN (format basique)
    const isIsbn = /^[0-9Xx]{10,13}$/.test(cleanedIsbn);
    
    if (!isIsbn) {
      console.log('[DETAIL] L\'ID fourni n\'est pas un ISBN valide:', bookId);
      return {
        description: '',
        subjects: [],
        numberOfPages: 0,
        publishDate: '',
        publishers: [],
      };
    }
    
    // Essayer d'abord l'endpoint direct
    let endpoint = `/book/${cleanedIsbn}`;
    let url = `${ISBNDB_BASE_URL}${endpoint}`;
    
    console.log(`[DETAIL] Envoi requête détails: ${url}`);
    
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': ISBNDB_API_KEY,
        'Accept': 'application/json',
      }
    });
    
    console.log(`[DETAIL] Statut réponse: ${response.status} ${response.statusText}`);
    
    // Si l'endpoint direct échoue, essayer l'endpoint de recherche général
    if (!response.ok) {
      console.log('[DETAIL] ISBN non trouvé avec l\'endpoint direct, tentative avec l\'endpoint /search');
      
      const searchUrl = `${ISBNDB_BASE_URL}/search?page=1&pageSize=1&q=${cleanedIsbn}`;
      console.log(`[DETAIL] Nouvelle tentative avec: ${searchUrl}`);
      
      response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Authorization': ISBNDB_API_KEY,
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        console.log(`[DETAIL] Échec de la recherche générale, statut: ${response.status}`);
        
        // Si ça échoue encore, essayer avec l'endpoint spécifique pour les ISBN
        const isbnSearchUrl = `${ISBNDB_BASE_URL}/search/books?page=1&pageSize=1&isbn13=${cleanedIsbn}`;
        console.log(`[DETAIL] Dernière tentative avec: ${isbnSearchUrl}`);
        
        const isbnResponse = await fetch(isbnSearchUrl, {
          method: 'GET',
          headers: {
            'Authorization': ISBNDB_API_KEY,
            'Accept': 'application/json',
          }
        });
        
        if (!isbnResponse.ok) {
          throw new Error(`Erreur ISBNDB (recherche ISBN): ${isbnResponse.status} ${isbnResponse.statusText}`);
        }
        
        const isbnData = await isbnResponse.json();
        
        if (isbnData.books && isbnData.books.length > 0) {
          const book = isbnData.books[0];
          console.log('[DETAIL] Livre trouvé par recherche ISBN:', book.title);
          
          return {
            description: cleanDescription(book.synopsis || ''),
            subjects: book.subjects || [],
            numberOfPages: book.pages || 0,
            publishDate: book.date_published || '',
            publishers: book.publisher ? [book.publisher] : [],
            isbn: book.isbn13 || book.isbn,
            language: book.language ? [book.language] : ['fr'],
          };
        }
        
        throw new Error(`Aucun livre trouvé avec cet ISBN: ${cleanedIsbn}`);
      }
    }
    
    const data = await response.json();
    console.log('[DETAIL] Structure de la réponse:', Object.keys(data));
    
    if (data.book) {
      // Format de réponse de l'endpoint /book/{isbn}
      const book = data.book;
      console.log('[DETAIL] Détails reçus:', JSON.stringify(book, null, 2));
      
      return {
        description: cleanDescription(book.synopsis || ''),
        subjects: book.subjects || [],
        numberOfPages: book.pages || 0,
        publishDate: book.date_published || '',
        publishers: book.publisher ? [book.publisher] : [],
        isbn: book.isbn13 || book.isbn,
        language: book.language ? [book.language] : ['fr'],
      };
    } else if (data.results && data.results.length > 0) {
      // Format de réponse de l'endpoint /search
      const bookResults = data.results.filter((result: any) => result.type === 'book');
      
      if (bookResults.length > 0) {
        const book = bookResults[0].book || bookResults[0];
        console.log('[DETAIL] Livre trouvé via recherche générale:', book.title);
        
        return {
          description: cleanDescription(book.synopsis || ''),
          subjects: book.subjects || [],
          numberOfPages: book.pages || 0,
          publishDate: book.date_published || '',
          publishers: book.publisher ? [book.publisher] : [],
          isbn: book.isbn13 || book.isbn,
          language: book.language ? [book.language] : ['fr'],
        };
      }
    }
    
    console.log('[DETAIL] Aucun détail trouvé pour ce livre');
    return {
      description: '',
      subjects: [],
      numberOfPages: 0,
      publishDate: '',
      publishers: [],
    };
  } catch (error) {
    console.error('[DETAIL] Erreur lors de la récupération des détails du livre:', error);
    return {
      description: '',
      subjects: [],
      numberOfPages: 0,
      publishDate: '',
      publishers: [],
    };
  }
}
