
import { Book } from '@/types/book';
import { translateToFrench } from '@/utils/translation';
import { getCachedSearch, cacheSearchResults } from './searchCache';

export const GOOGLE_BOOKS_API_KEY = 'AIzaSyDUQ2dB8e_EnUp14DY9GnYAv2CmGiqBapY';

export async function searchGoogleBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    // Vérifier d'abord le cache
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

      // Ensure description is translated
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

    // Mettre en cache les résultats
    await cacheSearchResults(query, books);

    return books;
  } catch (error) {
    console.error('Erreur lors de la recherche Google Books:', error);
    return [];
  }
}
