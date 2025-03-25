
import { Book } from '@/types/book';
import { removeDuplicateBooks, filterNonBookResults, isAuthorMatch } from '@/lib/utils';

export type SearchType = 'author' | 'title' | 'general';
export type LanguageFilter = 'fr' | 'en';

// Clé API ISBNDB
const ISBNDB_API_KEY = '60264_3de7f2f024bc350bfa823cbbd9e64315';
const ISBNDB_BASE_URL = 'https://api2.isbndb.com';

// Fonction pour faire une recherche par auteur avec l'endpoint correct
export async function searchAuthorBooks(authorName: string, language: LanguageFilter = 'fr', maxResults: number = 100): Promise<Book[]> {
  if (!authorName.trim()) return [];
  
  try {
    const encodedAuthorName = encodeURIComponent(authorName);
    // Utiliser l'endpoint /author/ spécifique comme indiqué dans l'API
    const url = `${ISBNDB_BASE_URL}/author/${encodedAuthorName}?pageSize=${maxResults}&language=${language}`;
    
    console.log(`Recherche par auteur: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': ISBNDB_API_KEY,
        'Accept': 'application/json'
      },
      // Ajouter mode: 'cors' pour résoudre les problèmes CORS
      mode: 'cors'
    });
    
    if (!response.ok) {
      console.error(`Erreur ISBNDB (recherche auteur): ${response.status} ${response.statusText}`);
      throw new Error(`Erreur ISBNDB (recherche auteur): ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Réponse de la recherche par auteur:', data);
    
    // Vérifier si l'API a retourné les livres de l'auteur
    if (data.books && Array.isArray(data.books)) {
      const books = data.books.map((book: any) => mapIsbndbBookToBook(book, authorName));
      
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
  const url = `${ISBNDB_BASE_URL}/books/${encodeURIComponent(authorName)}?pageSize=${maxResults}&language=${language}`;
  
  console.log(`Recherche alternative: ${url}`);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': ISBNDB_API_KEY,
      'Accept': 'application/json'
    },
    mode: 'cors'
  });
  
  if (!response.ok) {
    throw new Error(`Erreur recherche alternative: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('Réponse de la recherche alternative:', data);
  
  if (!data.books || !Array.isArray(data.books)) {
    return [];
  }
  
  const books = data.books.map((book: any) => mapIsbndbBookToBook(book));
  
  // Filtrer pour ne garder que les livres qui correspondent vraiment à l'auteur
  const filteredBooks = books.filter(book => isAuthorMatch(book, authorName));
  
  return filterNonBookResults(filteredBooks);
}

// Ancienne fonction de recherche ISBNDB (conservée pour les autres types de recherche)
export async function searchIsbndb(query: string, searchType: SearchType = 'author', language: LanguageFilter = 'fr', maxResults: number = 100): Promise<Book[]> {
  if (!query.trim()) return [];
  
  try {
    let endpoint = '';
    let params = '';
    
    // Déterminer l'endpoint en fonction du type de recherche
    switch (searchType) {
      case 'author':
        // Utiliser le nouvel endpoint pour les auteurs
        return searchAuthorBooks(query, language, maxResults);
      case 'title':
        endpoint = `/books/${encodeURIComponent(query)}`;
        params = `?pageSize=${maxResults}&language=${language}`;
        break;
      case 'general':
        endpoint = `/books/${encodeURIComponent(query)}`;
        params = `?pageSize=${maxResults}&language=${language}`;
        break;
      default:
        endpoint = `/books/${encodeURIComponent(query)}`;
        params = `?pageSize=${maxResults}&language=${language}`;
    }

    const url = `${ISBNDB_BASE_URL}${endpoint}${params}`;
    console.log(`Requête ISBNDB (${searchType}): ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': ISBNDB_API_KEY,
        'Accept': 'application/json',
      },
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`Erreur ISBNDB: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Réponse ISBNDB:', data);

    // Transformer les résultats ISBNDB en format Book
    let books: Book[] = [];
    
    if (data.books) {
      books = data.books.map((book: any) => mapIsbndbBookToBook(book));
      
      // Filtrer les résultats si on cherche par titre
      if (searchType === 'title') {
        books = filterNonBookResults(books);
      }
    }

    return books;
  } catch (error) {
    console.error('Erreur lors de la recherche ISBNDB:', error);
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
    
    // Suppression des doublons
    const uniqueBooks = removeDuplicateBooks(filteredBooks);
    
    console.log(`Total des résultats après filtrage: ${uniqueBooks.length} livres (avant filtrage: ${books.length})`);
    
    return uniqueBooks;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
}
