
import { Book } from '@/types/book';

const ISBNDB_API_KEY = '60264_3de7f2f024bc350bfa823cbbd9e64315';
const ISBNDB_BASE_URL = 'https://api2.isbndb.com';

// Configuration des en-têtes pour les requêtes
const getHeaders = () => {
  return {
    'Authorization': ISBNDB_API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Access-Control-Allow-Origin': '*' // Demande explicite de CORS
  };
};

export async function getBookDetails(bookId: string, language: string = 'fr'): Promise<Partial<Book>> {
  try {
    console.log(`Récupération des détails pour le livre ID: ${bookId}, langue: ${language}`);
    
    if (!bookId) {
      console.error("ID de livre non valide");
      return {};
    }
    
    // Si l'ID commence par "isbndb-", c'est un ID généré et non un ISBN
    if (bookId.startsWith('isbndb-')) {
      console.log("ID généré détecté, impossible de récupérer plus de détails");
      return {};
    }
    
    const encodedBookId = encodeURIComponent(bookId);
    const url = `${ISBNDB_BASE_URL}/book/${encodedBookId}`;
    
    console.log(`URL de l'API pour les détails: ${url}`);
    console.log('En-têtes envoyés (détails):', getHeaders());
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      mode: 'cors' // Explicitement demander un mode CORS
    });
    
    console.log('Statut de réponse (détails):', response.status, response.statusText);
    
    if (!response.ok) {
      // Afficher le corps de la réponse en cas d'erreur pour le diagnostic
      try {
        const errorBody = await response.text();
        console.error('Corps de la réponse d\'erreur (détails):', errorBody);
      } catch (e) {
        console.error('Impossible de lire le corps de la réponse d\'erreur (détails)');
      }
      
      console.error(`Erreur API détails du livre: ${response.status} ${response.statusText}`);
      return {};
    }
    
    const data = await response.json();
    console.log('Données détaillées du livre reçues:', data);
    
    if (!data.book) {
      console.log("Aucune donnée de livre trouvée dans la réponse");
      return {};
    }
    
    const book = data.book;
    
    return {
      title: book.title || book.title_long,
      author: book.author || (book.authors && book.authors[0]),
      cover: book.image,
      description: book.synopsis,
      isbn: book.isbn13 || book.isbn,
      publishers: book.publisher ? [book.publisher] : [],
      subjects: book.subjects || [],
      numberOfPages: book.pages ? parseInt(book.pages, 10) : 0,
      publishDate: book.date_published,
      language: book.language ? [book.language] : [language],
      format: book.format,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du livre:', error);
    return {};
  }
}
