
import { Book } from '@/types/book';
import { removeDuplicateBooks } from '@/lib/utils';

export type SearchType = 'author' | 'title' | 'general' | 'isbn';

// Clé API ISBNDB
const ISBNDB_API_KEY = '60264_3de7f2f024bc350bfa823cbbd9e64315';
const ISBNDB_BASE_URL = 'https://api2.isbndb.com';

export async function searchIsbndb(query: string, searchType: SearchType = 'general'): Promise<Book[]> {
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
        // Vérifier si c'est un ISBN valide (format basique)
        const isValidIsbn = /^[0-9Xx]{10,13}$/.test(query.replace(/-/g, ''));
        
        if (isValidIsbn) {
          // D'abord essayer l'endpoint book direct pour un ISBN exact
          endpoint = `/book/${encodeURIComponent(query.replace(/-/g, ''))}`;
        } else {
          // Si ce n'est pas un ISBN valide formatté, utiliser la recherche
          endpoint = `/search/books`;
          params = `?page=1&pageSize=20&isbn13=${encodeURIComponent(query)}`;
        }
        break;
      case 'general':
      default:
        endpoint = `/books/${encodeURIComponent(query)}`;
        params = '?page=1&pageSize=20';
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
      // Si la première tentative échoue pour l'ISBN et que nous avons utilisé l'endpoint book direct
      if (searchType === 'isbn' && endpoint.startsWith('/book/') && (response.status === 404 || response.status === 400)) {
        console.log('[ISBNDB] ISBN non trouvé avec l\'endpoint direct, tentative avec la recherche générale');
        
        // Tenter une recherche alternative par l'endpoint de recherche
        const searchUrl = `${ISBNDB_BASE_URL}/search/books?page=1&pageSize=20&isbn13=${encodeURIComponent(query.replace(/-/g, ''))}`;
        console.log(`[ISBNDB] Deuxième tentative: ${searchUrl}`);
        
        const searchResponse = await fetch(searchUrl, {
          method: 'GET',
          headers: {
            'Authorization': ISBNDB_API_KEY,
            'Accept': 'application/json',
          }
        });
        
        if (!searchResponse.ok) {
          throw new Error(`Erreur ISBNDB (deuxième tentative): ${searchResponse.status} ${searchResponse.statusText}`);
        }
        
        const searchData = await searchResponse.json();
        console.log('[ISBNDB] Structure de la réponse (deuxième tentative):', Object.keys(searchData));
        
        if (searchData.books && searchData.books.length > 0) {
          console.log(`[ISBNDB] ${searchData.books.length} livres trouvés par la recherche ISBN`);
          return searchData.books.map((book: any) => mapIsbndbBookToBook(book));
        }
        
        return [];
      }
      
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
          const authorBooks = author.books.map((book: any) => mapIsbndbBookToBook(book, author.name));
          books = [...books, ...authorBooks];
        }
      }
    } else if (searchType === 'isbn' && data.book) {
      // Pour la recherche par ISBN avec endpoint direct, on reçoit directement un livre
      console.log('[ISBNDB] Livre trouvé par ISBN:', data.book.title);
      books = [mapIsbndbBookToBook(data.book)];
    } else if (data.books) {
      // Pour les recherches par titre, générales ou par recherche ISBN
      console.log(`[ISBNDB] Nombre de livres reçus: ${data.books.length}`);
      
      if (data.books.length > 0) {
        console.log('[ISBNDB] Premier livre exemple:', JSON.stringify(data.books[0], null, 2));
      }
      
      books = data.books.map((book: any) => mapIsbndbBookToBook(book));
    }

    console.log(`[ISBNDB] Nombre de livres transformés: ${books.length}`);
    return books;
  } catch (error) {
    console.error('[ISBNDB] Erreur lors de la recherche:', error);
    throw error;
  }
}

function mapIsbndbBookToBook(isbndbBook: any, defaultAuthor?: string): Book {
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
    
    // Extraire les informations pertinentes et les adapter au format Book
    return {
      id,
      sourceId: isbndbBook.isbn13 || isbndbBook.isbn,
      title: isbndbBook.title || isbndbBook.title_long || 'Titre inconnu',
      author,
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
    
    // En cas d'erreur, retourner un livre avec des informations minimales mais obligatoires
    return {
      id: `isbndb-error-${Math.random().toString(36).substring(2, 9)}`,
      title: isbndbBook?.title || 'Erreur de conversion',
      author: isbndbBook?.author || defaultAuthor || 'Inconnu',
      language: ['fr'], // Champ obligatoire dans le type Book
    };
  }
}

export async function searchAllBooks(query: string, searchType: SearchType = 'general'): Promise<Book[]> {
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
    
    // Retourner un tableau vide en cas d'erreur
    return [];
  }
}
