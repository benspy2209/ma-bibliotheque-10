
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
  console.log('Récupération des détails pour le livre:', bookId);
  
  try {
    // Vérifier si l'ID est un ISBN
    const isIsbn = bookId.match(/^[0-9]{10}$|^[0-9]{13}$/);
    
    if (!isIsbn) {
      console.log('L\'ID fourni n\'est pas un ISBN valide:', bookId);
      return {
        description: '',
        subjects: [],
        numberOfPages: 0,
        publishDate: '',
        publishers: [],
      };
    }
    
    const endpoint = `${ISBNDB_BASE_URL}/book/${bookId}`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': ISBNDB_API_KEY,
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur ISBNDB: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Détails du livre:', data);
    
    if (data.book) {
      const book = data.book;
      
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
    
    return {
      description: '',
      subjects: [],
      numberOfPages: 0,
      publishDate: '',
      publishers: [],
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du livre:', error);
    return {
      description: '',
      subjects: [],
      numberOfPages: 0,
      publishDate: '',
      publishers: [],
    };
  }
}
