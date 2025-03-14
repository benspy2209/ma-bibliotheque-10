import { Book } from '@/types/book';

export const GOOGLE_BOOKS_API_KEY = 'AIzaSyDUQ2dB8e_EnUp14DY9GnYAv2CmGiqBapY';

export async function searchGoogleBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    // Encodage plus souple pour la recherche
    const encodedQuery = encodeURIComponent(query.replace(/['"]/g, ''));
    
    // Recherche avec intitle pour privilégier les correspondances exactes
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:"${encodedQuery}"&langRestrict=fr&maxResults=40&fields=items(id,volumeInfo)&key=${GOOGLE_BOOKS_API_KEY}`
    );

    // Si on atteint la limite de requêtes (429)
    if (response.status === 429) {
      console.log('Limite de requêtes Google Books atteinte, recherche uniquement via OpenLibrary');
      return [];
    }

    if (!response.ok) {
      throw new Error(`Erreur Google Books: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items) {
      console.log('Aucun résultat Google Books pour:', query);
      // Deuxième tentative avec une recherche plus large si aucun résultat
      const secondResponse = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&langRestrict=fr&maxResults=40&fields=items(id,volumeInfo)&key=${GOOGLE_BOOKS_API_KEY}`
      );
      
      if (secondResponse.status === 429) {
        console.log('Limite de requêtes Google Books atteinte sur la 2ème tentative');
        return [];
      }
      
      if (!secondResponse.ok) {
        throw new Error(`Erreur Google Books (2ème tentative): ${secondResponse.status}`);
      }
      
      const secondData = await secondResponse.json();
      if (!secondData.items) return [];
      data.items = secondData.items;
    }
    
    return data.items.map((item: any) => {
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
        language: [volumeInfo.language],
        isbn: volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier
      };
    }).filter(book => book.language[0] === 'fr');
  } catch (error) {
    console.error('Erreur lors de la recherche Google Books:', error);
    return [];
  }
}
