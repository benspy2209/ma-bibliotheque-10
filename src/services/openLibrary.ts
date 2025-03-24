
import { Book } from '@/types/book';
import { looksLikeISBN } from '@/lib/utils';

export async function searchBooks(query: string): Promise<Book[]> {
  if (!query) return [];

  try {
    // Déterminer si la requête est un ISBN
    const isISBNQuery = looksLikeISBN(query);
    
    // Construire l'URL de recherche en fonction du type de requête
    let searchUrl;
    if (isISBNQuery) {
      const cleanISBN = query.replace(/[-\s]/g, '');
      searchUrl = `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanISBN}&jscmd=data&format=json`;
    } else {
      searchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=40`;
    }

    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Traitement différent selon le type de recherche
    if (isISBNQuery) {
      // Format de réponse pour la recherche par ISBN
      const isbnKey = `ISBN:${query.replace(/[-\s]/g, '')}`;
      const book = data[isbnKey];
      
      if (!book) {
        console.log('Aucun livre trouvé par ISBN sur OpenLibrary');
        return [];
      }
      
      // Conversion au format de livre de l'application avec données complètes
      return [{
        id: `ol-isbn-${query}`,
        title: book.title || 'Titre inconnu',
        author: book.authors?.map((author: any) => author.name) || ['Auteur inconnu'],
        cover: book.cover?.medium || book.cover?.large || book.cover?.small || '/placeholder.svg',
        description: book.excerpts?.[0]?.text || book.description?.value || '',
        numberOfPages: book.number_of_pages,
        publishDate: book.publish_date,
        publishers: book.publishers?.map((pub: any) => pub.name) || [],
        subjects: book.subjects?.map((s: any) => s.name || s) || [],
        language: book.languages?.map((lang: any) => lang.key.replace('/languages/', '')) || ['fr'],
        isbn: query.replace(/[-\s]/g, '')
      }];
    } else {
      // Format de réponse pour la recherche par titre/auteur
      if (!data.docs) {
        console.log('Aucun livre trouvé sur OpenLibrary');
        return [];
      }
      
      const books = data.docs.map((doc: any) => {
        let cover = '/placeholder.svg';
        if (doc.cover_i) {
          cover = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
        }
        
        return {
          id: doc.key,
          title: doc.title,
          author: doc.author_name || ['Auteur inconnu'],
          cover: cover,
          language: doc.language || ['fr'],
          isbn: doc.isbn?.[0]
        };
      });
      
      console.log(`OpenLibrary: Trouvé ${books.length} livres pour la requête "${query}"`);
      return books;
    }
  } catch (error) {
    console.error('Erreur lors de la recherche OpenLibrary:', error);
    return [];
  }
}
