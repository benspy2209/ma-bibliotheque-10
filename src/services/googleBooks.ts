
import { Book } from '@/types/book';
import { translateToFrench } from '@/utils/translation';
import { getCachedSearch, cacheSearchResults } from './searchCache';

export const GOOGLE_BOOKS_API_KEY = 'AIzaSyDUQ2dB8e_EnUp14DY9GnYAv2CmGiqBapY';

// File d'attente avec retries et délais
const queue: Array<{
  request: () => Promise<any>;
  retries: number;
}> = [];
let isProcessing = false;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const BATCH_SIZE = 40;

async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  while (queue.length > 0) {
    const task = queue.shift();
    if (task) {
      try {
        await task.request();
      } catch (error) {
        if (task.retries > 0) {
          console.log(`Réessai de la requête (${task.retries} restants)`);
          queue.push({
            request: task.request,
            retries: task.retries - 1
          });
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
      // Attendre entre chaque requête
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  isProcessing = false;
}

async function enqueueRequest<T>(request: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    queue.push({
      request: async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      },
      retries: MAX_RETRIES
    });
    processQueue();
  });
}

async function fetchGoogleBooksPage(query: string, startIndex: number): Promise<any> {
  const response = await enqueueRequest(() => 
    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${BATCH_SIZE}&startIndex=${startIndex}&fields=items(id,volumeInfo),totalItems&key=${GOOGLE_BOOKS_API_KEY}`
    )
  );

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Rate limit atteint');
    }
    throw new Error(`Erreur Google Books: ${response.status}`);
  }

  return response.json();
}

export async function searchGoogleBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    const cachedResults = await getCachedSearch(query);
    if (cachedResults) {
      console.log('Résultats trouvés dans le cache pour:', query);
      return cachedResults;
    }

    let allBooks: Book[] = [];
    let startIndex = 0;
    let totalItems = Infinity;

    while (startIndex < totalItems && startIndex < 200) { // Limite à 200 résultats maximum
      try {
        const data = await fetchGoogleBooksPage(query, startIndex);
        totalItems = data.totalItems || 0;

        if (!data.items) break;

        const pageBooks = await Promise.all(data.items.map(async (item: any) => {
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

        allBooks = [...allBooks, ...pageBooks.filter(Boolean)];
        startIndex += BATCH_SIZE;

      } catch (error) {
        console.error('Erreur lors de la récupération de la page:', error);
        break;
      }
    }

    if (allBooks.length > 0) {
      await cacheSearchResults(query, allBooks);
    }

    return allBooks;
  } catch (error) {
    console.error('Erreur lors de la recherche Google Books:', error);
    return [];
  }
}
