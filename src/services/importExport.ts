
import { Book, ReadingStatus } from '@/types/book';
import { supabase } from '@/integrations/supabase/client';
import { saveBook } from './supabaseBooks';
import { v4 as uuidv4 } from 'uuid';

/**
 * Exporte la bibliothèque de l'utilisateur actuel au format JSON
 */
export async function exportLibrary(): Promise<{success: boolean, data?: any, error?: string}> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Erreur d\'authentification:', authError);
      return { 
        success: false, 
        error: 'Vous devez être connecté pour exporter votre bibliothèque'
      };
    }
    
    // Récupération de tous les livres de l'utilisateur
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Erreur lors de l\'exportation:', error);
      return { 
        success: false, 
        error: `Erreur lors de l'exportation: ${error.message}` 
      };
    }
    
    // Vérifier si des livres ont été récupérés
    if (!data || data.length === 0) {
      console.log('Aucun livre trouvé pour l\'exportation');
      return {
        success: true,
        data: {
          version: '1.0',
          timestamp: new Date().toISOString(),
          userId: user.id,
          email: user.email,
          books: []
        }
      };
    }
    
    // Formatage des données pour l'export
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      userId: user.id,
      email: user.email,
      books: data.map(book => {
        // S'assurer que toutes les données du livre sont incluses
        return {
          ...book.book_data,
          status: book.status || book.book_data?.status || 'to-read',
          completion_date: book.completion_date || book.book_data?.completionDate
        };
      })
    };
    
    console.log(`Exportation de ${data.length} livres terminée avec succès.`);
    
    return { 
      success: true, 
      data: exportData 
    };
  } catch (error) {
    console.error('Erreur lors de l\'exportation:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'exportation' 
    };
  }
}

/**
 * Importe une bibliothèque depuis un fichier JSON
 */
export async function importLibrary(
  importData: any
): Promise<{success: boolean, imported: number, errors: number, message?: string}> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Erreur d\'authentification:', authError);
      return { 
        success: false, 
        imported: 0, 
        errors: 0, 
        message: 'Vous devez être connecté pour importer une bibliothèque'
      };
    }
    
    console.log('Structure des données importées:', JSON.stringify(importData, null, 2).substring(0, 500) + '...');
    
    // Détection du format des données
    let booksToImport: any[] = [];
    
    // Format 1: { books: [...] }
    if (importData.books && Array.isArray(importData.books)) {
      console.log('Format détecté: { books: [...] }');
      booksToImport = importData.books;
    } 
    // Format 2: [...] (tableau direct de livres)
    else if (Array.isArray(importData)) {
      console.log('Format détecté: tableau direct');
      booksToImport = importData;
    }
    // Format 3: Recherche récursive pour trouver un tableau de livres
    else {
      console.log('Recherche récursive de données...');
      const findBooksArray = (obj: any): any[] | null => {
        if (!obj || typeof obj !== 'object') return null;
        
        // Si c'est un tableau avec des objets qui ont des propriétés comme title, author
        if (Array.isArray(obj) && obj.length > 0 && 
            obj[0] && typeof obj[0] === 'object' && 
            (obj[0].title || (obj[0].book_data && obj[0].book_data.title))) {
          return obj;
        }
        
        // Recherche dans toutes les propriétés
        for (const key in obj) {
          if (key === 'books' && Array.isArray(obj[key])) {
            return obj[key];
          }
          
          const result = findBooksArray(obj[key]);
          if (result) return result;
        }
        
        return null;
      };
      
      const foundBooks = findBooksArray(importData);
      if (foundBooks) {
        console.log(`Format détecté: structure imbriquée, ${foundBooks.length} livres trouvés`);
        booksToImport = foundBooks;
      } else {
        // Tentative de dernière chance - rechercher des propriétés ressemblant à des livres
        for (const key in importData) {
          if (importData[key] && Array.isArray(importData[key])) {
            console.log(`Essai avec la propriété: ${key} (${importData[key].length} éléments)`);
            booksToImport = importData[key];
            if (booksToImport.length > 0 && 
                (booksToImport[0].title || 
                 (booksToImport[0].book_data && booksToImport[0].book_data.title))) {
              console.log(`Format détecté: propriété ${key}`);
              break;
            }
          }
        }
      }
    }
    
    // Vérification finale que nous avons des livres à importer
    if (!booksToImport.length) {
      console.error('Aucun livre trouvé dans les données importées');
      return {
        success: false,
        imported: 0,
        errors: 0,
        message: 'Format de données invalide: aucun livre trouvé'
      };
    }
    
    console.log(`${booksToImport.length} livres trouvés dans les données importées`);
    
    // Statistiques d'importation
    let imported = 0;
    let errors = 0;
    let duplicates = 0;
    
    // Pour chaque livre dans le fichier d'import
    for (let i = 0; i < booksToImport.length; i++) {
      try {
        const bookItem = booksToImport[i];
        console.log(`Traitement du livre ${i+1}/${booksToImport.length}: ${JSON.stringify(bookItem).substring(0, 100)}...`);
        
        // Trouver les données du livre selon différents formats possibles
        let bookData = bookItem;
        let bookStatus: ReadingStatus = 'to-read';
        let completionDate = undefined;
        
        // Format où les données du livre sont dans book_data
        if (bookItem.book_data) {
          bookData = bookItem.book_data;
          // FIX: Vérifier que le statut est valide avant de l'assigner
          const status = bookItem.status || bookData.status || 'to-read';
          bookStatus = validateReadingStatus(status);
          completionDate = bookItem.completion_date || bookData.completionDate;
        } else {
          // Si le statut est une propriété directe
          const status = bookItem.status || 'to-read';
          bookStatus = validateReadingStatus(status);
          completionDate = bookItem.completionDate || bookItem.completion_date;
        }
        
        // Vérification de base pour s'assurer que c'est un livre valide
        if (!bookData.title && !bookData.author) {
          console.warn(`Livre #${i+1} ignoré: données de base manquantes`, bookData);
          errors++;
          continue;
        }
        
        // Construction du livre avec un nouvel ID
        const book: Book = {
          id: uuidv4(), // Nouvel ID pour éviter les conflits
          title: bookData.title || 'Titre inconnu',
          author: bookData.author || 'Auteur inconnu',
          language: Array.isArray(bookData.language) ? bookData.language : ['unknown'],
          status: bookStatus,
          completionDate: completionDate
        };
        
        // Copie des propriétés optionnelles si elles existent
        if (bookData.sourceId) book.sourceId = bookData.sourceId;
        if (bookData.cover) book.cover = bookData.cover;
        if (bookData.rating) book.rating = bookData.rating;
        if (bookData.purchased !== undefined) book.purchased = bookData.purchased;
        if (bookData.numberOfPages) book.numberOfPages = bookData.numberOfPages;
        if (bookData.publishDate) book.publishDate = bookData.publishDate;
        if (bookData.series) book.series = bookData.series;
        if (bookData.description) book.description = bookData.description;
        if (bookData.publishers) book.publishers = bookData.publishers;
        if (bookData.subjects) book.subjects = bookData.subjects;
        if (bookData.isbn) book.isbn = bookData.isbn;
        if (bookData.readingTimeDays) book.readingTimeDays = bookData.readingTimeDays;
        if (bookData.review) book.review = bookData.review;
        
        // Sauvegarde du livre dans la base de données
        const result = await saveBook(book);
        
        if (result.success) {
          imported++;
          console.log(`Livre importé avec succès: "${book.title}"`);
        } else {
          if (result.error === 'duplicate') {
            duplicates++;
            console.log(`Livre dupliqué ignoré: "${book.title}"`);
          } else {
            errors++;
            console.error(`Erreur lors de l'importation du livre "${book.title}":`, result.message);
          }
        }
      } catch (error) {
        errors++;
        console.error('Erreur lors du traitement d\'un livre:', error);
      }
    }
    
    return {
      success: true,
      imported,
      errors,
      message: `Importation terminée: ${imported} livres importés, ${errors} erreurs, ${duplicates} doublons ignorés`
    };
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    return {
      success: false,
      imported: 0,
      errors: 0,
      message: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'importation'
    };
  }
}

/**
 * Valide et normalise un statut de lecture
 * Si le statut n'est pas valide, retourne 'to-read' par défaut
 */
function validateReadingStatus(status: string): ReadingStatus {
  const validStatuses: ReadingStatus[] = ['to-read', 'reading', 'completed'];
  
  // Vérification directe
  if (validStatuses.includes(status as ReadingStatus)) {
    return status as ReadingStatus;
  }
  
  // Tentative de normalisation pour différentes variations possibles
  const normalizedStatus = status.toLowerCase().trim();
  
  if (normalizedStatus === 'to-read' || normalizedStatus === 'to read' || normalizedStatus === 'à lire' || normalizedStatus === 'a lire') {
    return 'to-read';
  }
  if (normalizedStatus === 'reading' || normalizedStatus === 'en cours' || normalizedStatus === 'en lecture' || normalizedStatus === 'lu partiellement') {
    return 'reading';
  }
  if (normalizedStatus === 'completed' || normalizedStatus === 'read' || normalizedStatus === 'lu' || normalizedStatus === 'terminé' || normalizedStatus === 'termine') {
    return 'completed';
  }
  
  // Statut par défaut si aucune correspondance
  console.log(`Statut non reconnu "${status}", utilisation de la valeur par défaut "to-read"`);
  return 'to-read';
}
