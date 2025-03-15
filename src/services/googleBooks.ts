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
const RETRY_DELAY = 5000;
const BATCH_SIZE = 40; // Augmenté pour récupérer plus de résultats par requête
const MAX_RESULTS = 200; // Augmenté pour plus de résultats au total

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
  const searchQueries = [
    `inauthor:"${query}"`,
    `intitle:"${query}"`,
    query
  ];
  
  for (const searchQuery of searchQueries) {
    try {
      const response = await enqueueRequest(() => 
        fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}` +
          `&printType=books` +
          `&maxResults=${BATCH_SIZE}` +
          `&startIndex=${startIndex}` +
          `&langRestrict=fr` +
          `&fields=items(id,volumeInfo),totalItems` +
          `&key=${GOOGLE_BOOKS_API_KEY}`
        )
      );

      if (!response.ok) {
        if (response.status === 429) {
          console.log('Rate limit atteint, attente plus longue...');
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          continue;
        }
        throw new Error(`Erreur Google Books: ${response.status}`);
      }

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        return data;
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }

  return { items: [], totalItems: 0 };
}

export async function searchGoogleBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    // On utilise le cache seulement si on n'a pas de résultats des APIs
    const cachedResults = await getCachedSearch(query);

    let allBooks: Book[] = [];
    let startIndex = 0;
    let seenIds = new Set();

    while (startIndex < MAX_RESULTS) {
      try {
        console.log(`Récupération des résultats ${startIndex} à ${startIndex + BATCH_SIZE} pour ${query}`);
        const data = await fetchGoogleBooksPage(query, startIndex);

        if (!data.items || data.items.length === 0) break;

        const pageBooks = await Promise.all(
          data.items.map(async (item: any) => {
            if (seenIds.has(item.id)) return null;
            seenIds.add(item.id);

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
              console.error('Erreur lors du traitement du livre:', error);
              return null;
            }
          })
        );

        const validBooks = pageBooks.filter(Boolean);
        allBooks = [...allBooks, ...validBooks];
        
        if (validBooks.length === 0) break;
        
        startIndex += BATCH_SIZE;
        await new Promise(resolve => setTimeout(resolve, 3000));

      } catch (error) {
        console.error('Erreur lors de la récupération de la page:', error);
        if (error.message.includes('Rate limit')) {
          await new Promise(resolve => setTimeout(resolve, 10000));
          continue;
        }
        break;
      }
    }

    // On met en cache seulement si on a trouvé plus de résultats que ce qui était en cache
    if (allBooks.length > (cachedResults?.length || 0)) {
      await cacheSearchResults(query, allBooks);
      return allBooks;
    }

    return cachedResults || allBooks;
  } catch (error) {
    console.error('Erreur lors de la recherche Google Books:', error);
    return [];
  }
}
