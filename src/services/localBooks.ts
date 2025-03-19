
import { supabase } from './supabaseBooks';
import { Book } from '@/types/book';
import { v4 as uuidv4 } from 'uuid';

export async function searchLocalBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    console.log('Recherche dans la base de données locale...');
    
    // Recherche par titre, auteur ou description
    const { data, error } = await supabase
      .from('books_collection') // Remplacez par le nom réel de votre table
      .select('*')
      .or(`titre.ilike.%${query}%,auteur.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(50);
    
    if (error) {
      console.error('Erreur lors de la recherche locale:', error);
      return [];
    }

    console.log(`Résultats locaux trouvés: ${data?.length || 0}`);
    
    // Conversion du format de la base de données au format Book utilisé par l'application
    return (data || []).map(item => ({
      id: item.id || `/books/${uuidv4()}`,
      title: item.titre || 'Titre inconnu',
      author: item.auteur || 'Auteur inconnu',
      cover: item.couverture_url || undefined,
      language: item.langue ? [item.langue] : ['fr'],
      publishDate: item.date_publication,
      publishers: item.editeur ? [item.editeur] : undefined,
      description: item.description,
      isbn: item.isbn,
      numberOfPages: item.nombre_pages,
      subjects: item.sujets ? item.sujets.split(',').map((s: string) => s.trim()) : undefined,
    }));
  } catch (error) {
    console.error('Erreur lors de la recherche locale:', error);
    return [];
  }
}
