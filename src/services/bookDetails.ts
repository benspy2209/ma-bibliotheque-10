
import { Book } from '@/types/book';
import { LanguageFilter } from '@/services/bookSearch';

// Clé API ISBNDB
const ISBNDB_API_KEY = '60264_3de7f2f024bc350bfa823cbbd9e64315';
const ISBNDB_BASE_URL = 'https://api2.isbndb.com';

// Proxy CORS pour contourner les limitations CORS
const CORS_PROXY = 'https://corsproxy.io/?';

// Configuration des en-têtes pour les requêtes
const getHeaders = () => {
  return {
    'Authorization': ISBNDB_API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
  };
};

// Fonction pour construire l'URL avec le proxy CORS
const getProxiedUrl = (url: string) => {
  return `${CORS_PROXY}${encodeURIComponent(url)}`;
};

// Fonction pour récupérer les détails d'un livre par son ISBN
export async function getBookDetails(bookId: string, language: LanguageFilter = 'fr'): Promise<Partial<Book>> {
  if (!bookId) {
    console.error('ID de livre manquant pour la récupération des détails');
    return {};
  }

  try {
    // Extraire l'ISBN si l'ID contient un préfixe
    const isbn = bookId.startsWith('isbndb-') ? '' : bookId;
    
    if (!isbn) {
      console.log('Aucun ISBN disponible pour la récupération des détails');
      return {};
    }

    const originalUrl = `${ISBNDB_BASE_URL}/book/${isbn}`;
    const proxiedUrl = getProxiedUrl(originalUrl);
    
    console.log(`Récupération des détails du livre: ${originalUrl}`);

    const response = await fetch(proxiedUrl, {
      method: 'GET',
      headers: getHeaders(),
      mode: 'cors'
    });

    if (!response.ok) {
      console.error(`Erreur lors de la récupération des détails du livre: ${response.status} ${response.statusText}`);
      return {};
    }

    const data = await response.json();
    console.log('Détails du livre récupérés:', data);

    if (!data.book) {
      console.log('Aucun détail de livre trouvé');
      return {};
    }

    const book = data.book;
    return {
      title: book.title,
      author: book.authors?.[0] || book.author || '',
      cover: book.image,
      description: book.synopsis || '',
      isbn: book.isbn13 || book.isbn,
      publishers: book.publisher ? [book.publisher] : [],
      numberOfPages: book.pages || 0,
      publishDate: book.date_published || '',
      language: book.language ? [book.language] : [language],
      subjects: book.subjects || [],
      format: book.format || '',
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du livre:', error);
    return {};
  }
}
