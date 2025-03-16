import { Book } from '@/types/book';
import { translateToFrench } from '@/utils/translation';
import { getCachedSearch, cacheSearchResults } from './searchCache';
import { supabase } from './supabaseBooks';

export const GOOGLE_BOOKS_API_KEY = 'AIzaSyDUQ2dB8e_EnUp14DY9GnYAv2CmGiqBapY';

export async function searchFrenchBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    console.log('Recherche dans la base de données livres_francais pour:', query);
    
    // Recherche dans la table livres_francais (adapt your query based on the actual schema)
    const { data, error } = await supabase
      .from('livres_francais')
      .select('*')
      .ilike('title', `%${query}%`)
      .order('title');
    
    if (error) {
      console.error('Erreur lors de la recherche dans livres_francais:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('Aucun résultat trouvé dans livres_francais pour:', query);
      return [];
    }

    console.log('Résultats trouvés dans livres_francais:', data.length);
    
    // Convertir les résultats au format Book
    return data.map(book => ({
      id: book.id || book.isbn || String(book.id_livre),
      title: book.title || book.titre,
      author: book.author ? [book.author] : book.auteur ? [book.auteur] : ['Auteur inconnu'],
      cover: book.cover || book.couverture || '/placeholder.svg',
      description: book.description || book.resume || '',
      numberOfPages: book.nombre_pages || book.page_count,
      publishDate: book.date_publication || book.publish_date,
      publishers: [book.editeur || book.publisher].filter(Boolean),
      subjects: book.categories ? (Array.isArray(book.categories) ? book.categories : [book.categories]) : [],
      language: ['fr'],
      isbn: book.isbn || ''
    }));
  } catch (error) {
    console.error('Erreur lors de la recherche dans livres_francais:', error);
    return [];
  }
}

export async function searchGoogleBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    const cachedResults = await getCachedSearch(query);
    if (cachedResults) {
      console.log('Résultats trouvés dans le cache pour:', query);
      return cachedResults;
    }

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=40&fields=items(id,volumeInfo)&key=${GOOGLE_BOOKS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Erreur Google Books: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items) {
      console.log('Aucun résultat Google Books pour:', query);
      return [];
    }
    
    const books = await Promise.all(data.items.map(async (item: any) => {
      const volumeInfo = item.volumeInfo;
      
      let cover = '/placeholder.svg';
      if (volumeInfo.imageLinks) {
        cover = volumeInfo.imageLinks.extraLarge || 
                volumeInfo.imageLinks.large || 
                volumeInfo.imageLinks.medium || 
                volumeInfo.imageLinks.thumbnail || 
                volumeInfo.imageLinks.smallThumbnail;
                
        cover = cover.replace('http:', 'https:');
      }

      let description = volumeInfo.description || '';
      description = await translateToFrench(description);

      return {
        id: item.id,
        title: volumeInfo.title,
        author: volumeInfo.authors || ['Auteur inconnu'],
        cover: cover,
        description,
        numberOfPages: volumeInfo.pageCount,
        publishDate: volumeInfo.publishedDate,
        publishers: [volumeInfo.publisher].filter(Boolean),
        subjects: volumeInfo.categories || [],
        language: [volumeInfo.language],
        isbn: volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier
      };
    }));

    await cacheSearchResults(query, books);

    return books;
  } catch (error) {
    console.error('Erreur lors de la recherche Google Books:', error);
    return [];
  }
}

export async function searchByISBN(isbn: string): Promise<Book[]> {
  if (!isbn.trim()) return [];

  try {
    // D'abord, chercher dans la base de données livres_francais
    console.log('Recherche ISBN dans livres_francais:', isbn);
    const { data: supabaseData, error } = await supabase
      .from('livres_francais')
      .select('*')
      .eq('isbn', isbn);

    if (!error && supabaseData && supabaseData.length > 0) {
      console.log('Livre trouvé dans livres_francais pour ISBN:', isbn);
      return supabaseData.map(book => ({
        id: book.id || book.isbn || String(book.id_livre),
        title: book.title || book.titre,
        author: book.author ? [book.author] : book.auteur ? [book.auteur] : ['Auteur inconnu'],
        cover: book.cover || book.couverture || '/placeholder.svg',
        description: book.description || book.resume || '',
        numberOfPages: book.nombre_pages || book.page_count,
        publishDate: book.date_publication || book.publish_date,
        publishers: [book.editeur || book.publisher].filter(Boolean),
        subjects: book.categories ? (Array.isArray(book.categories) ? book.categories : [book.categories]) : [],
        language: ['fr'],
        isbn: isbn
      }));
    }

    // Si non trouvé dans livres_francais, vérifier le cache
    const cachedResults = await getCachedSearch(isbn);
    if (cachedResults) {
      console.log('Résultats trouvés dans le cache pour ISBN:', isbn);
      return cachedResults;
    }

    // Sinon, utiliser l'API Google Books
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&langRestrict=fr&maxResults=1&key=${GOOGLE_BOOKS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Erreur Google Books: ${response.status}`);
    }

    const googleData = await response.json();
    
    if (!googleData.items) {
      console.log('Aucun résultat Google Books pour ISBN:', isbn);
      return [];
    }

    const books = await Promise.all(googleData.items.map(async (item: any) => {
      const volumeInfo = item.volumeInfo;
      
      let cover = '/placeholder.svg';
      if (volumeInfo.imageLinks) {
        cover = volumeInfo.imageLinks.extraLarge || 
                volumeInfo.imageLinks.large || 
                volumeInfo.imageLinks.medium || 
                volumeInfo.imageLinks.thumbnail || 
                volumeInfo.imageLinks.smallThumbnail;
                
        cover = cover.replace('http:', 'https:');
      }

      let description = volumeInfo.description || '';
      description = await translateToFrench(description);

      return {
        id: item.id,
        title: volumeInfo.title,
        author: volumeInfo.authors || ['Auteur inconnu'],
        cover: cover,
        description,
        numberOfPages: volumeInfo.pageCount,
        publishDate: volumeInfo.publishedDate,
        publishers: [volumeInfo.publisher].filter(Boolean),
        subjects: volumeInfo.categories || [],
        language: [volumeInfo.language],
        isbn: isbn
      };
    }));

    await cacheSearchResults(isbn, books);
    return books;
  } catch (error) {
    console.error('Erreur lors de la recherche ISBN:', error);
    return [];
  }
}
