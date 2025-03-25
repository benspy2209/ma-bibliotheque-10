
import { Book, BookFormat } from '@/types/book';
import { removeDuplicateBooks, filterNonBookResults, isAuthorMatch } from '@/lib/utils';
import axios from 'axios';

export type SearchType = 'author' | 'title' | 'general';
export type LanguageFilter = 'fr' | 'en';

// Clé API ISBNDB
const ISBNDB_API_KEY = '60264_3de7f2f024bc350bfa823cbbd9e64315';
const ISBNDB_BASE_URL = 'https://api2.isbndb.com';

// Créer une instance axios avec la configuration de base
const isbndbApi = axios.create({
  baseURL: ISBNDB_BASE_URL,
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
    // Utiliser l'endpoint /author/ spécifique comme indiqué dans l'API
    const url = `/author/${encodedAuthorName}?pageSize=${maxResults}&language=${language}`;
    
    console.log(`Recherche par auteur: ${url}`);
    
    const response = await isbndbApi.get(url);
    
    console.log('Réponse de la recherche par auteur:', response.data);
    
    // Vérifier si l'API a retourné les livres de l'auteur
    if (response.data.books && Array.isArray(response.data.books)) {
      const books = response.data.books.map((book: any) => mapIsbndbBookToBook(book, authorName));
      
      // Application des filtres améliorés
      const filteredBooks = books.filter(book => {
        // S'assurer que le livre est bien de l'auteur recherché
        return isAuthorMatch(book, authorName) && 
               // Exclure certains types de livres par titre
               !book.title.toLowerCase().includes('dictionnaire') &&
               !book.title.toLowerCase().includes('encyclopédie') &&
               !book.title.toLowerCase().includes('manuel de') &&
               !book.title.toLowerCase().includes('guide pratique') &&
               !book.title.toLowerCase().includes('méthode') &&
               !book.title.toLowerCase().includes('cours de');
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

// Nouveau: Fonction dédiée pour la recherche par titre
export async function searchBooksByTitle(title: string, language: LanguageFilter = 'fr', maxResults: number = 100): Promise<Book[]> {
  if (!title.trim()) return [];
  
  try {
    const encodedTitle = encodeURIComponent(title);
    // Utiliser l'endpoint /books avec paramètre page_size pour la recherche par titre
    const url = `/books/${encodedTitle}?page=1&pageSize=${maxResults}&column=title&language=${language}`;
    
    console.log(`Recherche par titre: ${url}`);
    
    const response = await isbndbApi.get(url);
    
    console.log('Réponse de la recherche par titre:', response.data);
    
    if (response.data.books && Array.isArray(response.data.books)) {
      const books = response.data.books.map((book: any) => mapIsbndbBookToBook(book));
      
      // Filtrer les résultats pour qu'ils correspondent mieux au titre recherché
      const filteredBooks = books.filter(book => {
        const bookTitle = book.title.toLowerCase();
        const searchTitle = title.toLowerCase();
        
        // Vérification plus stricte pour les correspondances de titre
        return (bookTitle.includes(searchTitle) || 
                searchTitle.includes(bookTitle.substring(0, Math.min(bookTitle.length, 10)))) &&
               !bookTitle.includes('dictionnaire') &&
               !bookTitle.includes('encyclopédie') &&
               !bookTitle.includes('manuel de') &&
               !bookTitle.includes('guide pratique');
      });
      
      console.log(`Livres filtrés pour le titre ${title}: ${filteredBooks.length} sur ${books.length}`);
      return filterNonBookResults(filteredBooks);
    }
    
    return [];
  } catch (error) {
    console.error('Erreur lors de la recherche par titre:', error);
    return [];
  }
}

// Méthode de recherche alternative en cas d'échec de la première
async function fallbackAuthorSearch(authorName: string, language: LanguageFilter, maxResults: number): Promise<Book[]> {
  try {
    const url = `/books/${encodeURIComponent(authorName)}?pageSize=${maxResults}&language=${language}`;
    
    console.log(`Recherche alternative: ${url}`);
    
    const response = await isbndbApi.get(url);
    
    console.log('Réponse de la recherche alternative:', response.data);
    
    if (!response.data.books || !Array.isArray(response.data.books)) {
      return [];
    }
    
    const books = response.data.books.map((book: any) => mapIsbndbBookToBook(book));
    
    // Filtrage plus strict des résultats
    const filteredBooks = books.filter(book => {
      return isAuthorMatch(book, authorName) && 
             !book.title.toLowerCase().includes('dictionnaire') &&
             !book.title.toLowerCase().includes('encyclopédie') &&
             !book.title.toLowerCase().includes('manuel de') &&
             !book.title.toLowerCase().includes('guide pratique') &&
             !book.title.toLowerCase().includes('méthode') &&
             !book.title.toLowerCase().includes('cours de');
    });
    
    return filterNonBookResults(filteredBooks);
  } catch (error) {
    console.error('Erreur lors de la recherche alternative:', error);
    throw error;
  }
}

// Fonction pour rechercher plusieurs livres par ISBN en une seule requête
export async function searchBooksByIsbns(isbns: string[]): Promise<Book[]> {
  if (!isbns || isbns.length === 0) return [];
  
  try {
    const isbnString = isbns.join(',');
    console.log(`Recherche par ISBN multiples: ${isbnString}`);
    
    const response = await isbndbApi.post('/books', `isbns=${isbnString}`);
    
    console.log('Réponse de la recherche par ISBN multiples:', response.data);
    
    if (response.data.books && Array.isArray(response.data.books)) {
      return response.data.books.map((book: any) => mapIsbndbBookToBook(book));
    }
    
    return [];
  } catch (error) {
    console.error('Erreur lors de la recherche par ISBN multiples:', error);
    return [];
  }
}

// Ancienne fonction de recherche ISBNDB (mise à jour pour utiliser des fonctions spécifiques)
export async function searchIsbndb(query: string, searchType: SearchType = 'author', language: LanguageFilter = 'fr', maxResults: number = 100): Promise<Book[]> {
  if (!query.trim()) return [];
  
  try {
    // Déterminer le type de recherche et utiliser la fonction appropriée
    switch (searchType) {
      case 'author':
        return searchAuthorBooks(query, language, maxResults);
      case 'title':
        return searchBooksByTitle(query, language, maxResults);
      case 'general':
        // Pour une recherche générale, on peut combiner les résultats des deux types de recherche
        const authorResults = await searchAuthorBooks(query, language, maxResults/2);
        const titleResults = await searchBooksByTitle(query, language, maxResults/2);
        
        // Fusionner les résultats en évitant les doublons
        return removeDuplicateBooks([...authorResults, ...titleResults]).slice(0, maxResults);
      default:
        return searchBooksByTitle(query, language, maxResults);
    }
  } catch (error) {
    console.error('Erreur lors de la recherche ISBNDB:', error);
    return [];
  }
}

function detectBookFormat(isbndbBook: any): BookFormat {
  // Vérifier si c'est un livre audio
  if (isbndbBook.title?.toLowerCase().includes('audio') || 
      isbndbBook.title?.toLowerCase().includes('cd') ||
      isbndbBook.format?.toLowerCase().includes('audio') ||
      isbndbBook.binding?.toLowerCase().includes('audio')) {
    return 'audio';
  }
  
  // Vérifier si c'est un ebook
  if (isbndbBook.format?.toLowerCase().includes('ebook') ||
      isbndbBook.binding?.toLowerCase().includes('ebook') ||
      isbndbBook.format?.toLowerCase().includes('kindle') ||
      isbndbBook.binding?.toLowerCase().includes('kindle')) {
    return 'ebook';
  }
  
  // Par défaut, considérer comme imprimé
  return 'print';
}

function mapIsbndbBookToBook(isbndbBook: any, defaultAuthor?: string): Book {
  // Détecter le format du livre
  const format = detectBookFormat(isbndbBook);
  
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
    format,
  };
}

export async function searchAllBooks(query: string, searchType: SearchType = 'author', language: LanguageFilter = 'fr', maxResults: number = 100): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    console.log(`Démarrage de la recherche: "${query}" (type: ${searchType}, langue: ${language})`);
    
    const books = await searchIsbndb(query, searchType, language, maxResults);
    
    if (books.length === 0) {
      console.log(`Aucun résultat trouvé via la recherche ${searchType}, tentative avec la méthode alternative`);
      
      // Si la recherche par auteur échoue, essayer la recherche par titre, et vice versa
      if (searchType === 'author') {
        return await searchBooksByTitle(query, language, maxResults);
      } else if (searchType === 'title') {
        return await searchAuthorBooks(query, language, maxResults);
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
