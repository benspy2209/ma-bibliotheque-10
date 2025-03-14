
import { Book } from '@/types/book';

export const GOOGLE_BOOKS_API_KEY = 'AIzaSyDUQ2dB8e_EnUp14DY9GnYAv2CmGiqBapY';

export async function searchGoogleBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=inauthor:"${encodeURIComponent(query)}"&langRestrict=fr&maxResults=40&fields=items(id,volumeInfo)&key=${GOOGLE_BOOKS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la recherche Google Books');
    }

    const data = await response.json();
    
    if (!data.items) return [];
    
    return data.items
      .filter((item: any) => {
        const volumeInfo = item.volumeInfo;
        return volumeInfo.language === 'fr' || volumeInfo.language === 'fre';
      })
      .map((item: any) => {
        const volumeInfo = item.volumeInfo;
      
        // Améliorons la gestion des couvertures
        let cover = '/placeholder.svg';
        if (volumeInfo.imageLinks) {
          // Essayons d'abord d'obtenir la meilleure qualité possible
          cover = volumeInfo.imageLinks.extraLarge || 
                  volumeInfo.imageLinks.large || 
                  volumeInfo.imageLinks.medium || 
                  volumeInfo.imageLinks.thumbnail || 
                  volumeInfo.imageLinks.smallThumbnail;
                  
          // Assurons-nous que l'URL est en HTTPS
          cover = cover.replace('http:', 'https:');
        }

        return {
          id: item.id,
          title: volumeInfo.title,
          author: volumeInfo.authors || ['Auteur inconnu'],
          cover: cover,
          description: volumeInfo.description || '',
          numberOfPages: volumeInfo.pageCount,
          publishDate: volumeInfo.publishedDate,
          publishers: [volumeInfo.publisher].filter(Boolean),
          subjects: volumeInfo.categories || [],
          language: ['fr'],
          isbn: volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier
        };
      });
  } catch (error) {
    console.error('Erreur lors de la recherche Google Books:', error);
    return [];
  }
}
