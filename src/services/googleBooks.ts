
import { Book } from '@/types/book';
import { translateToFrench } from '@/utils/translation';

export const GOOGLE_BOOKS_API_KEY = 'AIzaSyDUQ2dB8e_EnUp14DY9GnYAv2CmGiqBapY';

export async function searchGoogleBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    // Ajout du filtre de langue 'fr' pour récupérer seulement des livres en français
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&langRestrict=fr&maxResults=40&fields=items(id,volumeInfo)&key=${GOOGLE_BOOKS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Erreur Google Books: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items) {
      console.log('Aucun résultat Google Books pour:', query);
      return [];
    }
    
    const books = await Promise.all(data.items
      // Filtrer les livres sans titre ou qui ne sont pas en français
      .filter((item: any) => 
        item.volumeInfo && 
        item.volumeInfo.title &&
        (item.volumeInfo.language === 'fr' || !item.volumeInfo.language) // Accepter les livres sans langue spécifiée
      )
      .map(async (item: any) => {
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
          language: ['fr'], // Forcer la langue à français
          isbn: volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier
        };
      }));

    console.log(`Google Books: Trouvé ${books.length} livres en français pour "${query}"`);
    return books;
  } catch (error) {
    console.error('Erreur lors de la recherche Google Books:', error);
    return [];
  }
}
