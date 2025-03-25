
import { Book } from '@/types/book';
import { removeDuplicateBooks } from '@/lib/utils';
import { SearchLanguage } from '@/components/search/SearchBar';

export type SearchType = 'author' | 'title' | 'general' | 'isbn';

// Clé API ISBNDB
const ISBNDB_API_KEY = '60264_3de7f2f024bc350bfa823cbbd9e64315';
const ISBNDB_BASE_URL = 'https://api2.isbndb.com';

export async function searchIsbndb(query: string, searchType: SearchType = 'general', language: SearchLanguage = 'fr'): Promise<Book[]> {
  if (!query.trim()) return [];
  
  try {
    let endpoint = '';
    let params = '';
    
    // Déterminer l'endpoint en fonction du type de recherche
    switch (searchType) {
      case 'author':
        endpoint = `/authors/${encodeURIComponent(query)}`;
        params = '?page=1&pageSize=20';
        break;
      case 'title':
        endpoint = `/books/${encodeURIComponent(query)}`;
        params = '?page=1&pageSize=20';
        break;
      case 'isbn':
        // Si c'est un ISBN valide, on utilise l'endpoint book directement
        endpoint = `/book/${encodeURIComponent(query)}`;
        break;
      case 'general':
      default:
        endpoint = `/books/${encodeURIComponent(query)}`;
        params = '?page=1&pageSize=20';
    }

    // Ajouter le paramètre de langue si ce n'est pas l'endpoint book
    if (searchType !== 'isbn' && params) {
      params += `&language=${language}`;
    }

    const url = `${ISBNDB_BASE_URL}${endpoint}${params}`;
    console.log(`[ISBNDB] Envoi requête (${searchType}, langue: ${language}): ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': ISBNDB_API_KEY,
        'Accept': 'application/json',
      }
    });

    // Log de la réponse HTTP brute
    console.log(`[ISBNDB] Statut réponse: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      throw new Error(`Erreur ISBNDB: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Log détaillé de la structure de réponse
    console.log('[ISBNDB] Structure de la réponse:', Object.keys(data));
    
    // Transformer les résultats ISBNDB en format Book
    let books: Book[] = [];
    
    if (searchType === 'author' && data.authors) {
      // Pour la recherche par auteur, on récupère les livres associés
      console.log(`[ISBNDB] Recherche par auteur: ${data.authors.length} auteurs trouvés`);
      
      // On prend tous les livres de tous les auteurs qui correspondent
      books = [];
      for (const author of data.authors) {
        console.log(`[ISBNDB] Auteur trouvé: ${author.name} avec ${author.books?.length || 0} livres`);
        
        if (author.books && author.books.length > 0) {
          const authorBooks = author.books.map((book: any) => mapIsbndbBookToBook(book, author.name, language));
          books = [...books, ...authorBooks];
        }
      }
    } else if (searchType === 'isbn' && data.book) {
      // Pour la recherche par ISBN, on reçoit directement un livre
      console.log('[ISBNDB] Livre trouvé par ISBN:', data.book.title);
      books = [mapIsbndbBookToBook(data.book, undefined, language)];
    } else if (data.books) {
      // Pour les recherches par titre ou générales
      console.log(`[ISBNDB] Nombre de livres reçus: ${data.books.length}`);
      
      if (data.books.length > 0) {
        console.log('[ISBNDB] Premier livre exemple:', JSON.stringify(data.books[0], null, 2));
      }
      
      books = data.books.map((book: any) => mapIsbndbBookToBook(book, undefined, language));
    }

    // Filtrer par langue si nécessaire (hors recherche ISBN)
    if (searchType !== 'isbn') {
      books = books.filter(book => !book.language || book.language.includes(language));
    }

    console.log(`[ISBNDB] Nombre de livres transformés: ${books.length}`);
    return books;
  } catch (error) {
    console.error('[ISBNDB] Erreur lors de la recherche:', error);
    throw error;
  }
}

function mapIsbndbBookToBook(isbndbBook: any, defaultAuthor?: string, prefLanguage: SearchLanguage = 'fr'): Book {
  try {
    // Log pour déboguer la transformation d'un livre
    console.log(`[ISBNDB] Mappage du livre: ${isbndbBook.title || isbndbBook.title_long || 'Sans titre'}`);
    
    // Obtenir l'auteur du livre
    let author: string = 'Auteur inconnu';
    if (isbndbBook.author) {
      author = isbndbBook.author;
    } else if (isbndbBook.authors && isbndbBook.authors.length > 0) {
      author = isbndbBook.authors[0];
    } else if (defaultAuthor) {
      author = defaultAuthor;
    }
    
    // Déterminer l'identifiant unique
    const id = isbndbBook.isbn13 || isbndbBook.isbn || `isbndb-${Math.random().toString(36).substring(2, 9)}`;
    
    // Définir la langue du livre
    const bookLanguage = isbndbBook.language ? [isbndbBook.language] : [prefLanguage];
    
    // Extraire les informations pertinentes et les adapter au format Book
    return {
      id,
      sourceId: isbndbBook.isbn13 || isbndbBook.isbn,
      title: isbndbBook.title || isbndbBook.title_long || 'Titre inconnu',
      author,
      cover: isbndbBook.image || '',
      language: bookLanguage,
      isbn: isbndbBook.isbn13 || isbndbBook.isbn,
      publishers: isbndbBook.publisher ? [isbndbBook.publisher] : [],
      subjects: isbndbBook.subjects || [],
      description: isbndbBook.synopsis || '',
      numberOfPages: isbndbBook.pages || 0,
      publishDate: isbndbBook.date_published || '',
    };
  } catch (error) {
    console.error('[ISBNDB] Erreur lors du mappage du livre:', error, 'Données du livre:', isbndbBook);
    
    // En cas d'erreur, retourner un livre avec des informations minimales mais obligatoires
    return {
      id: `isbndb-error-${Math.random().toString(36).substring(2, 9)}`,
      title: isbndbBook?.title || 'Erreur de conversion',
      author: isbndbBook?.author || defaultAuthor || 'Inconnu',
      language: [prefLanguage], // Champ obligatoire dans le type Book
    };
  }
}

export async function searchAllBooks(query: string, searchType: SearchType = 'general', language: SearchLanguage = 'fr'): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    console.log(`[SEARCH] Démarrage recherche: "${query}" (type: ${searchType}, langue: ${language})`);
    
    // Tentative avec ISBNDB
    const books = await searchIsbndb(query, searchType, language);
    
    // Suppression des doublons
    const uniqueBooks = removeDuplicateBooks(books);
    
    console.log(`[SEARCH] Résultats finaux: ${uniqueBooks.length} livres uniques`);
    
    return uniqueBooks;
  } catch (error) {
    console.error('[SEARCH] Erreur lors de la recherche globale:', error);
    
    // Retourner un tableau vide en cas d'erreur
    return [];
  }
}
