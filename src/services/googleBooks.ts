
import { Book } from '@/types/book';
import { translateToFrench } from '@/utils/translation';

export const GOOGLE_BOOKS_API_KEY = 'AIzaSyDUQ2dB8e_EnUp14DY9GnYAv2CmGiqBapY';

const BATCH_SIZE = 20;
const MAX_RESULTS = 100;
const RETRY_DELAY = 2000;
const MAX_RETRIES = 5;

async function fetchGoogleBooksPage(query: string, startIndex: number): Promise<any> {
  const enhancedQuery = `${query}+subject:thriller+inlanguage:fr`;
  
  const url = `https://www.googleapis.com/books/v1/volumes?` +
    `q=${encodeURIComponent(enhancedQuery)}` +
    `&startIndex=${startIndex}` +
    `&maxResults=${BATCH_SIZE}` +
    `&langRestrict=fr` +
    `&fields=items(id,volumeInfo),totalItems` +
    `&key=${GOOGLE_BOOKS_API_KEY}`;

  let retries = MAX_RETRIES;
  
  while (retries > 0) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 429) {
          console.log(`Rate limit atteint, attente de ${RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          retries--;
          continue;
        }
        throw new Error(`Erreur Google Books: ${response.status}`);
      }

      const data = await response.json();
      if (!data.items) return { items: [] };
      return data;

    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      retries--;
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }

  return { items: [] };
}

export async function searchGoogleBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  const books: Book[] = [];
  const seenIds = new Set();

  for (let startIndex = 0; startIndex < MAX_RESULTS; startIndex += BATCH_SIZE) {
    console.log(`[Google Books] Récupération des résultats ${startIndex} à ${startIndex + BATCH_SIZE}`);
    
    const data = await fetchGoogleBooksPage(query, startIndex);
    if (!data.items || data.items.length === 0) break;

    for (const item of data.items) {
      if (seenIds.has(item.id)) continue;
      seenIds.add(item.id);

      const volumeInfo = item.volumeInfo;
      if (!volumeInfo || !volumeInfo.title) continue;

      let cover = '/placeholder.svg';
      if (volumeInfo.imageLinks) {
        cover = volumeInfo.imageLinks.thumbnail || 
                volumeInfo.imageLinks.smallThumbnail || 
                '/placeholder.svg';
        cover = cover.replace('http:', 'https:');
      }

      const description = await translateToFrench(volumeInfo.description || '');

      books.push({
        id: item.id,
        title: volumeInfo.title,
        author: volumeInfo.authors || ['Auteur inconnu'],
        cover,
        description,
        numberOfPages: volumeInfo.pageCount,
        publishDate: volumeInfo.publishedDate,
        publishers: [volumeInfo.publisher].filter(Boolean),
        subjects: volumeInfo.categories || [],
        language: [volumeInfo.language],
        isbn: volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier
      });
    }
  }

  console.log(`[Google Books] Total results: ${books.length}`);
  return books;
}
