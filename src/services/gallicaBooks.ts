
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
    const records = xmlDoc.getElementsByTagName('record');

    console.log('Nombre de résultats:', records.length);

    const books: Book[] = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const getElementText = (tagName: string) => {
        const elements = record.getElementsByTagName(tagName);
        return elements.length > 0 ? elements[0].textContent || '' : '';
      };

      const title = getElementText('dc:title');
      if (!title) continue;

      const arkId = getElementText('dc:identifier').split('ark:/')[1];
      if (!arkId) continue;

      const thumbnailUrl = `${IIIF_API}/ark:/${arkId}/f1/full/150,/0/native.jpg`;

      books.push({
        id: `gallica-${arkId}`,
        title,
        author: [getElementText('dc:creator') || 'Auteur inconnu'],
        cover: thumbnailUrl,
        description: getElementText('dc:description'),
        publishDate: getElementText('dc:date'),
        publishers: [getElementText('dc:publisher')].filter(Boolean),
        language: [getElementText('dc:language') || 'fr'],
        subjects: getElementText('dc:subject').split(';').filter(Boolean)
      });
    }

    return books;
  } catch (error) {
    console.error('Erreur lors de la recherche Gallica:', error);
    return [];
  }
}
