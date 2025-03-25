
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
    
    if (searchType === 'author' && data.books) {
      // Si c'est une recherche par auteur, la structure de réponse est différente
      const author = query; // Utiliser le nom de l'auteur qu'on a cherché
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
