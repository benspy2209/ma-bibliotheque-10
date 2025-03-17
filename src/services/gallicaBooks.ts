
import { Book } from '@/types/book';

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const GALLICA_SRU_API = 'https://gallica.bnf.fr/SRU';
const IIIF_API = 'https://gallica.bnf.fr/iiif';

export async function searchGallicaBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `${CORS_PROXY}${GALLICA_SRU_API}?operation=searchRetrieve&version=1.2&query=dc.title all "${encodedQuery}" or dc.creator all "${encodedQuery}"&maximumRecords=20&startRecord=1&recordSchema=dc`;

    console.log('Fetching from Gallica:', url);
    
    const response = await fetch(url, {
      headers: {
        'Origin': window.location.origin
      }
    });
    
    if (!response.ok) {
      console.error('Erreur Gallica:', response.status);
      return [];
    }

    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    const records = xmlDoc.getElementsByTagName('srw:record');

    console.log('Nombre de résultats:', records.length);

    const books: Book[] = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const getData = (tagName: string): string => {
        const elements = record.getElementsByTagName(tagName);
        for (let j = 0; j < elements.length; j++) {
          const content = elements[j].textContent;
          if (content && content.trim()) return content.trim();
        }
        return '';
      };

      const identifier = getData('dc:identifier') || '';
      const arkMatch = identifier.match(/ark:\/([^\/]+\/[^\/]+)/);
      if (!arkMatch) continue;

      const arkId = arkMatch[1];
      const title = getData('dc:title');
      if (!title) continue;

      const author = getData('dc:creator') || 'Auteur inconnu';
      const date = getData('dc:date');
      const description = getData('dc:description');
      const thumbnailUrl = `${IIIF_API}/ark:/${arkId}/f1/full/150,/0/native.jpg`;

      books.push({
        id: `gallica-${arkId}`,
        title,
        author: [author],
        cover: thumbnailUrl,
        description: description || '',
        publishDate: date || '',
        publishers: [],
        language: [getData('dc:language') || 'fr'],
        subjects: getData('dc:subject').split(';').filter(Boolean)
      });
    }

    console.log('Livres trouvés:', books.length);
    return books;
  } catch (error) {
    console.error('Erreur lors de la recherche Gallica:', error);
    return [];
  }
}
