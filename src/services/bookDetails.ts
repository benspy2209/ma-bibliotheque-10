
import { Book } from '@/types/book';
import { LanguageFilter } from '@/services/bookSearch';
import axios from 'axios';

// Clé API ISBNDB
const ISBNDB_API_KEY = '60264_3de7f2f024bc350bfa823cbbd9e64315';
const ISBNDB_BASE_URL = 'https://api2.isbndb.com';

// Configuration des en-têtes pour les requêtes
const getHeaders = () => {
  return {
    'Authorization': ISBNDB_API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

// Instance axios pré-configurée
const api = axios.create({
  headers: getHeaders()
});

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

    const url = `${ISBNDB_BASE_URL}/book/${isbn}`;
    
    console.log(`Récupération des détails du livre: ${url}`);

    const response = await api.get(url);
    console.log('Détails du livre récupérés:', response.data);

    if (!response.data || !response.data.book) {
      console.log('Aucun détail de livre trouvé');
      return {};
    }

    const book = response.data.book;
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
    
    // Tenter d'extraire plus d'informations sur l'erreur
    if (axios.isAxiosError(error)) {
      console.error('Détails de l\'erreur Axios:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
    
    return {};
  }
}

// Nouvelle fonction pour récupérer plusieurs livres par ISBN en parallèle
export async function getMultipleBookDetails(bookIds: string[], language: LanguageFilter = 'fr'): Promise<Partial<Book>[]> {
  if (!bookIds.length) return [];
  
  // Filtrer les IDs invalides
  const validBookIds = bookIds.filter(id => id && (id.startsWith('isbndb-') ? false : true));
  
  if (!validBookIds.length) {
    console.error('Aucun ISBN valide fourni pour la récupération des détails');
    return [];
  }
  
  try {
    // Créer un tableau de promesses pour chaque ISBN
    const requests = validBookIds.map(isbn => {
      const url = `${ISBNDB_BASE_URL}/book/${isbn}`;
      return api.get(url).catch(err => {
        console.error(`Erreur pour l'ISBN ${isbn}:`, err);
        return { data: null }; // Retourner un objet null en cas d'erreur
      });
    });
    
    // Exécuter toutes les requêtes en parallèle
    const responses = await Promise.all(requests);
    
    // Traiter les réponses et mapper les résultats
    const books = responses.map((response, index) => {
      if (!response.data || !response.data.book) {
        console.log(`Aucun détail trouvé pour l'ISBN ${validBookIds[index]}`);
        return { isbn: validBookIds[index] };
      }
      
      const book = response.data.book;
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
    }).filter(book => Object.keys(book).length > 1); // Ne garder que les livres avec des détails
    
    return books;
  } catch (error) {
    console.error('Erreur lors de la récupération en masse des détails de livres:', error);
    return [];
  }
}
