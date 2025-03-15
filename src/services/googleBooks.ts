
import { Book } from '@/types/book';
import { translateToFrench } from '@/utils/translation';
import { getCachedSearch, cacheSearchResults } from './searchCache';

export const GOOGLE_BOOKS_API_KEY = 'AIzaSyDUQ2dB8e_EnUp14DY9GnYAv2CmGiqBapY';

// File d'attente simple pour les requêtes
const queue: Array<() => Promise<void>> = [];
let isProcessing = false;

async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  while (queue.length > 0) {
    const task = queue.shift();
    if (task) {
      await task();
      // Attendre 1 seconde entre chaque requête pour éviter le rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  isProcessing = false;
}

async function enqueueRequest<T>(request: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    queue.push(async () => {
      try {
        const result = await request();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    processQueue();
  });
}

export async function searchGoogleBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    const cachedResults = await getCachedSearch(query);
    if (cachedResults) {
      console.log('Résultats trouvés dans le cache pour:', query);
      return cachedResults;
    }

    const response = await enqueueRequest(() => 
      fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=40&fields=items(id,volumeInfo)&key=${GOOGLE_BOOKS_API_KEY}`
      )
    );

    if (!response.ok) {
      if (response.status === 429) {
        console.log('Rate limit Google Books atteint, utilisation du cache si disponible');
        return await getCachedSearch(query) || [];
      }
      throw new Error(`Erreur Google Books: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items) {
      console.log('Aucun résultat Google Books pour:', query);
      return [];
    }
    
    const books = await Promise.all(data.items.map(async (item: any) => {
      try {
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

        const description = await translateToFrench(volumeInfo.description || '');

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
      } catch (error) {
        console.error('Erreur lors du traitement du livre Google Books:', error);
        return null;
      }
    }));

    const filteredBooks = books.filter(Boolean) as Book[];

    if (filteredBooks.length > 0) {
      await cacheSearchResults(query, filteredBooks);
    }

    return filteredBooks;
  } catch (error) {
    console.error('Erreur lors de la recherche Google Books:', error);
    return [];
  }
}
