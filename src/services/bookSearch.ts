import { Book } from '@/types/book';
import { removeDuplicateBooks, filterNonBookResults, isAuthorMatch } from '@/lib/utils';
import axios from 'axios';

export type SearchType = 'author' | 'title' | 'general';
export type LanguageFilter = 'fr' | 'en';

// Clé API ISBNDB
const ISBNDB_API_KEY = '60264_3de7f2f024bc350bfa823cbbd9e64315';
const ISBNDB_BASE_URL = 'https://api2.isbndb.com';

// Configuration de l'instance axios avec headers d'autorisation
const api = axios.create({
  headers: {
    'Authorization': ISBNDB_API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Fonction pour faire une recherche par auteur avec l'endpoint correct
export async function searchAuthorBooks(authorName: string, language: LanguageFilter = 'fr', maxResults: number = 100): Promise<Book[]> {
  if (!authorName.trim()) return [];
  
  try {
    const encodedAuthorName = encodeURIComponent(authorName);
    // Requête directe à l'API sans proxy
    const url = `${ISBNDB_BASE_URL}/author/${encodedAuthorName}?pageSize=${maxResults}&language=${language}`;
    
    console.log(`Recherche par auteur: ${url}`);
    
    const response = await api.get(url);
    
    console.log('Statut de réponse:', response.status);
    
    if (response.data && response.data.books && Array.isArray(response.data.books)) {
      const books = response.data.books.map((book: any) => mapIsbndbBookToBook(book, authorName));
      
      // Application des filtres améliorés
      const filteredBooks = books.filter(book => {
        // S'assurer que le livre est bien de l'auteur recherché
        return isAuthorMatch(book, authorName);
      });
      
      console.log(`Livres filtrés pour l'auteur ${authorName}: ${filteredBooks.length} sur ${books.length}`);
      return filterNonBookResults(filteredBooks);
    }
    
    return [];
  } catch (error) {
    console.error('Erreur lors de la recherche par auteur:', error);
    
    // En cas d'erreur, essayer la méthode de recherche alternative
    console.log("Tentative avec la méthode de recherche alternative...");
    try {
      return await fallbackAuthorSearch(authorName, language, maxResults);
    } catch (fallbackError) {
      console.error('Échec de la recherche alternative:', fallbackError);
      return [];
    }
  }
}

// Méthode de recherche alternative en cas d'échec de la première
async function fallbackAuthorSearch(authorName: string, language: LanguageFilter, maxResults: number): Promise<Book[]> {
  try {
    const url = `${ISBNDB_BASE_URL}/books/${encodeURIComponent(authorName)}?pageSize=${maxResults}&language=${language}`;
    
    console.log(`Recherche alternative: ${url}`);
    
    const response = await api.get(url);
    
    console.log('Statut de réponse (fallback):', response.status);
    
    if (response.data && response.data.books && Array.isArray(response.data.books)) {
      const books = response.data.books.map((book: any) => mapIsbndbBookToBook(book));
      
      // Filtrer pour ne garder que les livres qui correspondent vraiment à l'auteur
      const filteredBooks = books.filter(book => isAuthorMatch(book, authorName));
      
      return filterNonBookResults(filteredBooks);
    }
    
    return [];
  } catch (error) {
    console.error('Erreur lors de la recherche alternative:', error);
    return [];
  }
}

// Fonction pour la recherche par titre
export async function searchBooksByTitle(title: string, language: LanguageFilter = 'fr', maxResults: number = 100): Promise<Book[]> {
  if (!title.trim()) return [];
  
  try {
    const url = `${ISBNDB_BASE_URL}/books/${encodeURIComponent(title)}?pageSize=${maxResults}&language=${language}`;
    
    console.log(`Recherche par titre: ${url}`);
    
    const response = await api.get(url);
    
    console.log('Statut de réponse (titre):', response.status);
    
    if (response.data && response.data.books && Array.isArray(response.data.books)) {
      const books = response.data.books.map((book: any) => mapIsbndbBookToBook(book));
      return filterNonBookResults(books);
    }
    
    return [];
  } catch (error) {
    console.error('Erreur lors de la recherche par titre:', error);
    return [];
  }
}

// Fonction de recherche ISBNDB
export async function searchIsbndb(query: string, searchType: SearchType = 'author', language: LanguageFilter = 'fr', maxResults: number = 100): Promise<Book[]> {
  if (!query.trim()) return [];
  
  try {
    // Utiliser les fonctions spécifiques selon le type de recherche
    switch (searchType) {
      case 'author':
        return searchAuthorBooks(query, language, maxResults);
      case 'title':
        return searchBooksByTitle(query, language, maxResults);
      case 'general':
        // Pour la recherche générale, on utilise la recherche par titre comme base
        return searchBooksByTitle(query, language, maxResults);
      default:
        return searchBooksByTitle(query, language, maxResults);
    }
  } catch (error) {
    console.error('Erreur lors de la recherche ISBNDB:', error);
    return [];
  }
}

// Fonction pour récupérer plusieurs livres par ISBN en une seule requête
export async function getBulkBookDetails(isbns: string[], language: LanguageFilter = 'fr'): Promise<Book[]> {
  if (!isbns.length) return [];
  
  try {
    // Créer un tableau de promesses pour chaque ISBN
    const requests = isbns.map(isbn => {
      const url = `${ISBNDB_BASE_URL}/book/${isbn}`;
      return api.get(url).catch(err => {
        console.error(`Erreur pour l'ISBN ${isbn}:`, err);
        return { data: null }; // Retourner un objet null en cas d'erreur
      });
    });
    
    // Exécuter toutes les requêtes en parallèle
    const responses = await Promise.all(requests);
    
    // Traiter les réponses et mapper les résultats
    const books = responses
      .filter(response => response.data && response.data.book)
      .map(response => {
        const book = response.data.book;
        return mapIsbndbBookToBook(book);
      });
    
    return books;
  } catch (error) {
    console.error('Erreur lors de la récupération en masse des livres:', error);
    return [];
  }
}

function mapIsbndbBookToBook(isbndbBook: any, defaultAuthor?: string): Book {
  // Extraire les informations pertinentes et les adapter au format Book
  return {
    id: isbndbBook.isbn13 || isbndbBook.isbn || `isbndb-${Math.random().toString(36).substring(2, 9)}`,
    sourceId: isbndbBook.isbn13 || isbndbBook.isbn,
    title: isbndbBook.title || isbndbBook.title_long || 'Titre inconnu',
    author: isbndbBook.author || isbndbBook.authors?.[0] || defaultAuthor || 'Auteur inconnu',
    cover: isbndbBook.image || '',
    language: isbndbBook.language ? [isbndbBook.language] : ['fr'],
    isbn: isbndbBook.isbn13 || isbndbBook.isbn,
    publishers: isbndbBook.publisher ? [isbndbBook.publisher] : [],
    subjects: isbndbBook.subjects || [],
    description: isbndbBook.synopsis || '',
    numberOfPages: isbndbBook.pages || 0,
    publishDate: isbndbBook.date_published || '',
    format: isbndbBook.format || '',
  };
}

export async function searchAllBooks(query: string, searchType: SearchType = 'author', language: LanguageFilter = 'fr', maxResults: number = 100): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    console.log(`Démarrage de la recherche: "${query}" (type: ${searchType}, langue: ${language})`);
    
    const books = await searchIsbndb(query, searchType, language, maxResults);
    
    if (books.length === 0) {
      console.log("Aucun résultat trouvé via ISBNDB, tentative avec la méthode alternative");
      if (searchType === 'author') {
        // Tenter avec la recherche alternative si aucun résultat n'est trouvé
        return await fallbackAuthorSearch(query, language, maxResults);
      }
    }
    
    // Appliquer un filtre supplémentaire pour éliminer les dictionnaires et autres ouvrages techniques
    const filteredBooks = filterNonBookResults(books);
    
    // Suppression des doublons avec notre fonction améliorée
    const uniqueBooks = removeDuplicateBooks(filteredBooks);
    
    console.log(`Total des résultats après filtrage: ${uniqueBooks.length} livres (avant filtrage: ${books.length})`);
    
    return uniqueBooks;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
}
