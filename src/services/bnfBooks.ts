
import { Book } from '@/types/book';
import { translateToFrench } from '@/utils/translation';

const BNF_API_URL = 'https://catalogue.bnf.fr/api/SRU';

export async function searchBnfBooks(query: string): Promise<Book[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `${BNF_API_URL}?version=1.2&operation=searchRetrieve&query=bib.anywhere all "${encodedQuery}"&recordSchema=dublincore&maximumRecords=50`
    );

    if (!response.ok) {
      console.error('Erreur BnF:', response.status);
      return [];
    }

    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    const records = xmlDoc.getElementsByTagName('record');

    const books: Book[] = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const getElementText = (tagName: string) => {
        const elements = record.getElementsByTagName(tagName);
        return elements.length > 0 ? elements[0].textContent || '' : '';
      };

      const title = getElementText('dc:title');
      if (!title) continue;

      const author = getElementText('dc:creator');
      const description = await translateToFrench(getElementText('dc:description'));
      const date = getElementText('dc:date');
      const publisher = getElementText('dc:publisher');
      const identifier = getElementText('dc:identifier');

      books.push({
        id: `bnf-${identifier}`,
        title,
        author: author ? [author] : ['Auteur inconnu'],
        cover: '/placeholder.svg', // BnF n'offre pas directement les couvertures
        description,
        publishDate: date,
        publishers: publisher ? [publisher] : [],
        language: ['fr'],
        subjects: getElementText('dc:subject').split(';').filter(Boolean)
      });
    }

    return books;
  } catch (error) {
    console.error('Erreur lors de la recherche BnF:', error);
    return [];
  }
}
