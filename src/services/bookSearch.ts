
import { Book } from '@/types/book';
import { removeDuplicateBooks } from '@/lib/utils';

export type SearchType = 'author' | 'title' | 'general';

// Clé API ISBNDB
const ISBNDB_API_KEY = '60264_3de7f2f024bc350bfa823cbbd9e64315';
const ISBNDB_BASE_URL = 'https://api2.isbndb.com';

export async function searchIsbndb(query: string, searchType: SearchType = 'author'): Promise<Book[]> {
  if (!query.trim()) return [];
  
  try {
    let endpoint = '';
    let params = '';
    
    // Déterminer l'endpoint en fonction du type de recherche
    // Utiliser les endpoints corrects en se basant sur la documentation ISBNDB
    switch (searchType) {
      case 'author':
        endpoint = `/author/${encodeURIComponent(query)}`;
        params = '?page=1&pageSize=20';
        break;
      case 'title':
        endpoint = `/books/${encodeURIComponent(query)}`;
        break;
      case 'general':
        endpoint = `/books/${encodeURIComponent(query)}`;
        break;
      default:
        endpoint = `/books/${encodeURIComponent(query)}`;
    }

    const url = `${ISBNDB_BASE_URL}${endpoint}${params}`;
    console.log(`[ISBNDB] Envoi requête (${searchType}): ${url}`);

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
    console.log(`[ISBNDB] Nombre de livres reçus: ${data.books ? data.books.length : 0}`);
    
    if (data.books && data.books.length > 0) {
      console.log('[ISBNDB] Premier livre exemple:', JSON.stringify(data.books[0], null, 2));
    }

    // Transformer les résultats ISBNDB en format Book
    let books: Book[] = [];
    
    if (searchType === 'author' && data.books) {
      // Si c'est une recherche par auteur, la structure de réponse est différente
      const author = query; // Utiliser le nom de l'auteur qu'on a cherché
      books = data.books.map((book: any) => mapIsbndbBookToBook(book, author));
    } else if (data.books) {
      // Pour les recherches par titre ou générales
      books = data.books.map((book: any) => mapIsbndbBookToBook(book));
    }

    console.log(`[ISBNDB] Nombre de livres transformés: ${books.length}`);
    return books;
  } catch (error) {
    console.error('[ISBNDB] Erreur lors de la recherche:', error);
    // Rethrow pour permettre une meilleure gestion par l'appelant
    throw error;
  }
}

function mapIsbndbBookToBook(isbndbBook: any, defaultAuthor?: string): Book {
  try {
    // Log pour déboguer la transformation d'un livre
    console.log(`[ISBNDB] Mappage du livre: ${isbndbBook.title || isbndbBook.title_long || 'Sans titre'}`);
    
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
    };
  } catch (error) {
    console.error('[ISBNDB] Erreur lors du mappage du livre:', error, 'Données du livre:', isbndbBook);
    // En cas d'erreur, retourner un livre avec des informations minimales
    return {
      id: `isbndb-error-${Math.random().toString(36).substring(2, 9)}`,
      title: isbndbBook?.title || 'Erreur de conversion',
      author: isbndbBook?.author || defaultAuthor || 'Inconnu',
    };
  }
}

export async function searchAllBooks(query: string, searchType: SearchType = 'author'): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    console.log(`[SEARCH] Démarrage recherche: "${query}" (type: ${searchType})`);
    
    // Tentative avec ISBNDB
    const books = await searchIsbndb(query, searchType);
    
    // Suppression des doublons
    const uniqueBooks = removeDuplicateBooks(books);
    
    console.log(`[SEARCH] Résultats finaux: ${uniqueBooks.length} livres uniques`);
    
    return uniqueBooks;
  } catch (error) {
    console.error('[SEARCH] Erreur lors de la recherche globale:', error);
    
    // Afficher une notification d'erreur ici ou gérer autrement
    
    // Retourner un tableau vide en cas d'erreur
    return [];
  }
}
