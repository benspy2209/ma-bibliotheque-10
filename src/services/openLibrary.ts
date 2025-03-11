
import { Book } from '@/types/book';

const OPEN_LIBRARY_API = 'https://openlibrary.org';

export async function searchBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    // Amélioration de la recherche en utilisant le paramètre author
    const response = await fetch(
      `${OPEN_LIBRARY_API}/search.json?q=${encodeURIComponent(query)}&language=fre&fields=key,title,author_name,cover_i,language,first_publish_date&limit=20`
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la recherche');
    }

    const data = await response.json();
    
    return data.docs
      .filter((doc: any) => 
        // Filtre plus précis pour les auteurs
        doc.author_name?.some((author: string) => 
          author.toLowerCase().includes(query.toLowerCase())
        )
      )
      .map((doc: any) => ({
        id: doc.key,
        title: doc.title,
        author: doc.author_name || ['Auteur inconnu'],
        cover: doc.cover_i 
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
          : '/placeholder.svg',
        language: doc.language || [],
        publishDate: doc.first_publish_date
      }));
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
}
