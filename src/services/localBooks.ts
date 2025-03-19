
import { supabase } from './supabaseBooks';
import { Book } from '@/types/book';
import { v4 as uuidv4 } from 'uuid';

export async function searchLocalBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];

  try {
    console.log(`Recherche pour "${query}" dans la base de données locale "livres_francais"...`);
    
    // Log de la requête pour le débogage
    console.log(`Exécution de la requête: SELECT * FROM livres_francais WHERE titre ILIKE '%${query}%' OR auteur ILIKE '%${query}%' OR description ILIKE '%${query}%'`);
    
    // Recherche par titre, auteur ou description
    const { data, error } = await supabase
      .from('livres_francais')
      .select('*')
      .or(`titre.ilike.%${query}%,auteur.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(50);
    
    if (error) {
      console.error('Erreur lors de la recherche locale:', error);
      return [];
    }

    console.log(`Résultats locaux trouvés: ${data?.length || 0}`);
    if (data && data.length > 0) {
      console.log('Premier résultat:', data[0]);
    } else {
      console.log('Aucun résultat trouvé dans la base locale pour:', query);
      
      // Test avec une requête simple pour vérifier que la table existe et est accessible
      const { count, error: countError } = await supabase
        .from('livres_francais')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Erreur lors du comptage des entrées dans la table:', countError);
      } else {
        console.log(`La table livres_francais contient ${count} entrées au total`);
      }
    }
    
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
