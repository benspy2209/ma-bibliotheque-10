import { Book } from '@/types/book';
import { removeDuplicateBooks, filterNonBookResults, isAuthorMatch, isTitleExplicitMatch } from '@/lib/utils';
import axios from 'axios';

export type SearchType = 'author' | 'title' | 'isbn';
export type LanguageFilter = 'fr' | 'en' | 'nl' | 'es' | 'de' | 'pt' | 'it';

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

// Function to search books by ISBN
export async function searchBooksByISBN(isbn: string, language: LanguageFilter = 'fr'): Promise<Book[]> {
  if (!isbn.trim()) return [];
  
  try {
    const cleanedISBN = isbn.replace(/[^0-9X]/g, ''); // Remove non-numeric characters except X
    const url = `${ISBNDB_BASE_URL}/book/${cleanedISBN}`;
    
    console.log(`Recherche par ISBN: ${url}`);
    
    const response = await api.get(url);
    
    console.log('Statut de réponse (ISBN):', response.status);
    
    if (response.data && response.data.book) {
      const book = mapIsbndbBookToBook(response.data.book);
      return [book]; // Return as array with single book
    }
    
    return [];
  } catch (error) {
    console.error('Erreur lors de la recherche par ISBN:', error);
    return [];
  }
}

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
      
      // Application des filtres améliorés - vérification stricte de l'auteur
      const filteredByAuthor = books.filter(book => isAuthorMatch(book, authorName));
      console.log(`Livres filtrés par correspondance stricte d'auteur: ${filteredByAuthor.length} sur ${books.length}`);
      
      // Application du filtre pour éliminer les livres non désirés
      const finalFilteredBooks = filterNonBookResults(filteredByAuthor);
      console.log(`Livres après filtre complet pour l'auteur ${authorName}: ${finalFilteredBooks.length} sur ${books.length}`);
      
      return finalFilteredBooks;
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
      
      // Filtrer pour ne garder que les livres qui correspondent vraiment à l'auteur - vérification stricte
      const filteredByAuthor = books.filter(book => isAuthorMatch(book, authorName));
      console.log(`Livres filtrés par correspondance stricte d'auteur (fallback): ${filteredByAuthor.length} sur ${books.length}`);
      
      // Application du filtre pour éliminer les livres non désirés
      const finalFilteredBooks = filterNonBookResults(filteredByAuthor);
      console.log(`Livres après filtre complet (fallback): ${finalFilteredBooks.length} sur ${books.length}`);
      
      return finalFilteredBooks;
    }
    
    return [];
  } catch (error) {
    console.error('Erreur lors de la recherche alternative:', error);
    return [];
  }
}

// Fonction pour la recherche par titre with enhanced filtering
export async function searchBooksByTitle(title: string, language: LanguageFilter = 'fr', maxResults: number = 100): Promise<Book[]> {
  if (!title.trim()) return [];
  
  try {
    const url = `${ISBNDB_BASE_URL}/books/${encodeURIComponent(title)}?pageSize=${maxResults}&language=${language}`;
    
    console.log(`Recherche par titre: ${url}`);
    
    const response = await api.get(url);
    
    console.log('Statut de réponse (titre):', response.status);
    
    if (response.data && response.data.books && Array.isArray(response.data.books)) {
      const books = response.data.books.map((book: any) => mapIsbndbBookToBook(book));
      
      // Appliquer un filtre plus strict pour les correspondances de titre
      const filteredByTitle = books.filter(book => isTitleExplicitMatch(book, title));
      
      console.log(`Livres filtrés par correspondance explicite de titre: ${filteredByTitle.length} sur ${books.length}`);
      
      // Appliquer le filtrage des livres non désirés
      const finalFilteredBooks = filterNonBookResults(filteredByTitle);
      
      console.log(`Livres après filtrage complet: ${finalFilteredBooks.length} sur ${filteredByTitle.length}`);
      
      // Further filter to eliminate exhibition catalogs and art books
      const nonExhibitionBooks = finalFilteredBooks.filter(book => {
        // Exclude books with "exposition", "exhibition", "catalogue", etc. in the title
        const titleLower = book.title.toLowerCase();
        
        // Check for explicit art exhibition indicators in the title
        return !(
          titleLower.includes('exposition') ||
          titleLower.includes('exhibition') ||
          titleLower.includes('catalogue') ||
          titleLower.includes('catalog') ||
          titleLower.includes('matisse') ||
          titleLower.includes('picasso') ||
          titleLower.includes('centre pompidou') ||
          titleLower.includes('musée') ||
          titleLower.includes('museum') ||
          titleLower.includes('/album') ||
          titleLower.includes('comme un roman')
        );
      });
      
      console.log(`Résultats après filtrage des catalogues d'exposition: ${nonExhibitionBooks.length} sur ${finalFilteredBooks.length}`);
      
      return nonExhibitionBooks;
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
      case 'isbn':
        return searchBooksByISBN(query, language);
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
  const bookAuthor = isbndbBook.author || isbndbBook.authors?.[0] || defaultAuthor || 'Auteur inconnu';
  
  return {
    id: isbndbBook.isbn13 || isbndbBook.isbn || `isbndb-${Math.random().toString(36).substring(2, 9)}`,
    sourceId: isbndbBook.isbn13 || isbndbBook.isbn,
    title: isbndbBook.title || isbndbBook.title_long || 'Titre inconnu',
    author: bookAuthor,
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

export async function searchAllBooks(query: string, searchType: SearchType = 'title', language: LanguageFilter = 'fr', maxResults: number = 100): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    console.log(`Démarrage de la recherche: "${query}" (type: ${searchType}, langue: ${language})`);
    
    const books = await searchIsbndb(query, searchType, language, maxResults);
    
    if (books.length === 0) {
      console.log("Aucun résultat trouvé via ISBNDB");
      return [];
    }
    
    // Suppression des doublons avec notre fonction améliorée
    const uniqueBooks = removeDuplicateBooks(books);
    
    console.log(`Total des résultats après suppression des doublons: ${uniqueBooks.length} livres (avant: ${books.length})`);
    
    return uniqueBooks;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
}
