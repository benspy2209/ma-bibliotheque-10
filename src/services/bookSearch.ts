
import { Book } from '@/types/book';
import { removeDuplicateBooks } from '@/lib/utils';

export type SearchType = 'author' | 'title' | 'general';
export type LanguageFilter = 'fr' | 'en';

// Clé API ISBNDB
const ISBNDB_API_KEY = '60264_3de7f2f024bc350bfa823cbbd9e64315';
const ISBNDB_BASE_URL = 'https://api2.isbndb.com';

// Nouvelle fonction pour faire une recherche par auteur avec le nouvel endpoint
export async function searchAuthorBooks(authorName: string, language: LanguageFilter = 'fr'): Promise<Book[]> {
  if (!authorName.trim()) return [];
  
  try {
    const encodedAuthorName = encodeURIComponent(authorName);
    const url = `${ISBNDB_BASE_URL}/author/${encodedAuthorName}?page=1&pageSize=20&language=${language}`;
    
    console.log(`Recherche par auteur avec le nouvel endpoint: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': ISBNDB_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur ISBNDB (recherche auteur): ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Réponse de la recherche par auteur:', data);
    
    // Vérifie si l'API a retourné les livres de l'auteur
    if (data.books && Array.isArray(data.books)) {
      return data.books.map((book: any) => mapIsbndbBookToBook(book, authorName));
    }
    
    return [];
  } catch (error) {
    console.error('Erreur lors de la recherche par auteur:', error);
    return [];
  }
}

// Ancienne fonction de recherche ISBNDB (conservée pour les autres types de recherche)
export async function searchIsbndb(query: string, searchType: SearchType = 'author', language: LanguageFilter = 'fr'): Promise<Book[]> {
  if (!query.trim()) return [];
  
  try {
    let endpoint = '';
    let params = '';
    
    // Déterminer l'endpoint en fonction du type de recherche
    switch (searchType) {
      case 'author':
        // Utiliser le nouvel endpoint pour les auteurs
        return searchAuthorBooks(query, language);
      case 'title':
        endpoint = `/books/${encodeURIComponent(query)}`;
        params = `?page=1&pageSize=20&language=${language}`;
        break;
      case 'general':
        endpoint = `/books/${encodeURIComponent(query)}`;
        params = `?page=1&pageSize=20&language=${language}`;
        break;
      default:
        endpoint = `/books/${encodeURIComponent(query)}`;
        params = `?page=1&pageSize=20&language=${language}`;
    }

    const url = `${ISBNDB_BASE_URL}${endpoint}${params}`;
    console.log(`Requête ISBNDB (${searchType}): ${url}`);

    const response = await fetch(url, {
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
    console.log('Réponse ISBNDB:', data);

    // Transformer les résultats ISBNDB en format Book
    let books: Book[] = [];
    
    if (data.books) {
      books = data.books.map((book: any) => mapIsbndbBookToBook(book));
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
  };
}

export async function searchAllBooks(query: string, searchType: SearchType = 'author', language: LanguageFilter = 'fr'): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    const books = await searchIsbndb(query, searchType, language);
    
    // Suppression des doublons
    const uniqueBooks = removeDuplicateBooks(books);
    
    console.log(`Total des résultats: ${uniqueBooks.length} livres`);
    
    return uniqueBooks;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
}
