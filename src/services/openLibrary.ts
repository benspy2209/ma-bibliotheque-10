
import { Book } from '@/types/book';

const OPEN_LIBRARY_API = 'https://openlibrary.org';

export async function searchBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    const response = await fetch(
      `${OPEN_LIBRARY_API}/search.json?q=${encodeURIComponent(query)}&language=fre&fields=key,title,author_name,cover_i,language`
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la recherche');
    }

    const data = await response.json();
    
    return data.docs
      .filter((doc: any) => doc.language?.includes('fre'))
      .map((doc: any) => ({
        id: doc.key,
        title: doc.title,
        author: doc.author_name || ['Auteur inconnu'],
        cover: doc.cover_i 
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
          : 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=687&auto=format&fit=crop',
        language: doc.language || []
      }));
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
}
