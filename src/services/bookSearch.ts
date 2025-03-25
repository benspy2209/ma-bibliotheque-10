
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
    
    // Déterminer l'endpoint en fonction du type de recherche
    switch (searchType) {
      case 'author':
        endpoint = `${ISBNDB_BASE_URL}/authors/${encodeURIComponent(query)}`;
        break;
      case 'title':
        endpoint = `${ISBNDB_BASE_URL}/books/${encodeURIComponent(query)}`;
        break;
      case 'general':
        endpoint = `${ISBNDB_BASE_URL}/books/${encodeURIComponent(query)}`;
        break;
      default:
        endpoint = `${ISBNDB_BASE_URL}/books/${encodeURIComponent(query)}`;
    }

    console.log(`Requête ISBNDB (${searchType}): ${endpoint}`);

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
    console.log('Réponse ISBNDB:', data);

    // Transformer les résultats ISBNDB en format Book
    let books: Book[] = [];
    
    if (searchType === 'author' && data.author && data.books) {
      // Si c'est une recherche par auteur, la structure de réponse est différente
      const author = data.author.name;
      books = data.books.map((book: any) => mapIsbndbBookToBook(book, author));
    } else if (data.books) {
      // Pour les recherches par titre ou générales
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
    title: isbndbBook.title || 'Titre inconnu',
    author: isbndbBook.authors || defaultAuthor || 'Auteur inconnu',
    cover: isbndbBook.image || '',
    language: isbndbBook.language || ['fr'],
    isbn: isbndbBook.isbn13 || isbndbBook.isbn,
    publishers: isbndbBook.publisher ? [isbndbBook.publisher] : [],
    subjects: isbndbBook.subjects || [],
    description: isbndbBook.synopsis || '',
    numberOfPages: isbndbBook.pages || 0,
    publishDate: isbndbBook.date_published || '',
  };
}

export async function searchAllBooks(query: string, searchType: SearchType = 'author'): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    const books = await searchIsbndb(query, searchType);
    
    // Suppression des doublons
    const uniqueBooks = removeDuplicateBooks(books);
    
    console.log(`Total des résultats: ${uniqueBooks.length} livres`);
    
    return uniqueBooks;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
}
