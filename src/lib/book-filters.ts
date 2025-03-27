
import { Book } from '@/types/book';
import { normalizeString } from './core-utils';

// Liste étendue et améliorée de mots-clés techniques à exclure
const TECHNICAL_KEYWORDS = [
  // Ouvrages techniques et académiques
  'manuel', 'guide', 'prospection', 'minier', 'minière', 'géologie', 'scientifique',
  'technique', 'rapport', 'étude', 'ingénierie', 'document', 'actes', 'conférence',
  'colloque', 'symposium', 'proceedings', 'thèse', 'mémoire', 'doctorat',
  
  // Ouvrages de référence
  'dictionnaire', 'encyclopédie', 'lexique', 'glossaire', 'référence', 'répertoire',
  'catalogue', 'index', 'annuaire', 'bibliographie', 'revue', 'périodique', 'collection',
  'compilation', 'atlas', 'critique', 'édition critique', 'chronologie', 'chronique',
  
  // Formats spécifiques
  'coffret', 'intégrale', 'recueil', 'almanach', 'traité', 'précis', 'abrégé', 
  'compendium', 'anthologie', 'mélanges', 'festschrift',
  
  // Documents personnels
  'correspondance', 'lettres', 'journal', 'carnets', 'cahiers', 'notes',
  
  // Contenus académiques/éducatifs
  'essais', 'études', 'leçons', 'cours', 'conférences', 'méthode', 
  'guide pratique', 'manuel de', 'théorie',
  
  // Ajouts de nouveaux mots-clés
  'publication', 'acta', 'annales', 'bulletin', 'cahier', 'rapport', 'mémoires',
  'compte-rendu', 'document', 'dossier', 'étude', 'fascicule', 'notice',
  'précis', 'procès-verbal', 'recueil', 'travaux', 'selected works', 'œuvres choisies',
  'œuvres complètes', 'complete works', 'selected writings', 'collected papers',
  'mélanges', 'miscellanea', 'série', 'collection', 'tome', 'volume',
  'agenda', 'éphéméride', 'yearbook', 'annuaire'
];

// Formats de livres à exclure dans les titres
const UNWANTED_FORMATS = [
  'audio cd', 'audiobook', 'audio book', 'livre audio', 'mp3', 
  'coffret', 'boxed set', 'box set', 'collector', 'édition spéciale', 
  'edition spéciale', 'special edition', 'collector\'s edition',
  'intégrale', 'complete collection', 'complete set', 'complete edition',
  'anthologie', 'anthology', 'collection complète', 'édition complète'
];

// Mots-clés spécifiques aux types de livres non désirés - liste étendue et améliorée
const UNWANTED_TYPES = [
  // Types d'ouvrages académiques/référence
  'dictionnaire', 'encyclopédie', 'traité', 'manuel', 'revue', 'journal',
  'magazine', 'périodique', 'bulletin', 'lexique', 'répertoire', 'compendium',
  'abrégé', 'précis', 'actes', 'proceedings', 'études', 'annales',
  'méthode', 'guide pratique', 'cours de',
  
  // Mots-clés religieux/théologiques
  'theolog', 'dogmat', 'canoni', 'ecclesiasti',
  
  // Mots-clés académiques
  'critiq', 'universel', 'sciences', 'geographi', 'chronologi', 'histori',
  
  // Nouveaux mots-clés à exclure
  'technique', 'technologi', 'méthodologi', 'pédagogi', 'didacti',
  'scientifi', 'académi', 'recherch', 'publi', 'éducati', 'enseignement',
  'collège', 'université', 'scolaire', 'doctoral', 'doctorat',
  'étudiant', 'bibliograph', 'bibliothéc', 'référence', 'document',
  'analyse', 'conférence', 'séminaire', 'étude', 'synthèse', 'résumé',
  'sommaire', 'abstract', 'proceedings', 'actes', 'recueil', 'collection',
  'publication', 'périodique', 'revue', 'magazine', 'bulletin'
];

// Liste de séries/personnages de BD/livres jeunesse qui peuvent apparaître dans les recherches
// et pourraient être attribués par erreur à un auteur recherché
const SERIES_CHARACTERS = [
  'schtroumpf', 'schtroumpfs', 'asterix', 'astérix', 'obelix', 'obélix', 'tintin',
  'pokemon', 'pokémon', 'naruto', 'dragon ball', 'disney', 'marvel', 'harry potter',
  'batman', 'superman', 'spider-man', 'winnie', 'mickey', 'minnie', 'dora', 'barbie'
];

export function filterNonBookResults(books: Book[]): Book[] {
  return books.filter(book => {
    if (!book.title) return false;
    
    const titleLower = book.title.toLowerCase();
    const authorString = Array.isArray(book.author) 
      ? book.author.join(' ').toLowerCase() 
      : (book.author || '').toLowerCase();
    const subjectsString = (book.subjects || []).join(' ').toLowerCase();
    const descriptionLower = (book.description || '').toLowerCase();
    const formatLower = (book.format || '').toLowerCase();
    
    const allText = `${titleLower} ${authorString} ${subjectsString} ${descriptionLower} ${formatLower}`;
    
    // Exclure les formats non désirés (audio, coffrets, etc.)
    const isUnwantedFormat = UNWANTED_FORMATS.some(format => 
      allText.includes(format.toLowerCase())
    );
    
    // Exclure les livres qui contiennent des mots-clés techniques
    const containsTechnicalKeywords = TECHNICAL_KEYWORDS.some(keyword => 
      allText.includes(keyword.toLowerCase())
    );
    
    // Exclure les livres dont le titre contient des types non désirés
    const containsUnwantedTypes = UNWANTED_TYPES.some(keyword => 
      titleLower.includes(keyword.toLowerCase())
    );
    
    // Exclure les livres dont le titre est trop générique ou suspect
    const isSuspiciousTitle = titleLower.startsWith('oeuvres de') || 
                              titleLower.startsWith('œuvres de') ||
                              titleLower.startsWith('oeuvres complètes') ||
                              titleLower.startsWith('œuvres complètes') ||
                              titleLower.includes('collection') ||
                              titleLower.includes('anthologie') ||
                              titleLower.includes('coffret') ||
                              titleLower.includes('l\'intégrale') ||
                              titleLower.includes('intégrale') ||
                              // Ajout de nouveaux filtres pour les titres suspects
                              titleLower.includes('dictionnaire') ||
                              titleLower.includes('encyclopédie') ||
                              titleLower.includes('traité de') ||
                              titleLower.includes('guide de') ||
                              titleLower.includes('manuel de') ||
                              titleLower.includes('précis de') ||
                              titleLower.includes('mémento') ||
                              titleLower.includes('bulletin') ||
                              titleLower.includes('annales') ||
                              titleLower.includes('mélanges') ||
                              titleLower.includes('actes du');
    
    // Exclure les formats audio explicites
    const isAudioBook = formatLower.includes('audio') || 
                        titleLower.includes('audio cd') || 
                        titleLower.includes('livre audio');
    
    // Filtrage des livres dont le titre est très long (souvent des publications académiques)
    const isTitleTooLong = titleLower.length > 100;
    
    // Vérifier si l'ouvrage pourrait être un livre de fiction (romans, nouvelles, etc.)
    const likelyFictionBook = titleLower.includes('roman') || 
                              titleLower.includes('fiction') ||
                              titleLower.includes('récit') ||
                              titleLower.includes('conte') ||
                              titleLower.includes('nouvelle') ||
                              subjectsString.includes('fiction') ||
                              subjectsString.includes('roman') ||
                              subjectsString.includes('littérature');
    
    // Si c'est probablement un livre de fiction, nous voulons le garder quelles que soient les autres règles
    if (likelyFictionBook) {
      return !isAudioBook; // Exclure uniquement si c'est un livre audio
    }
    
    // Vérification supplémentaire si le titre contient des personnages de BD/séries
    const containsSeriesCharacters = SERIES_CHARACTERS.some(character =>
      titleLower.includes(character.toLowerCase())
    );
    
    // Si le titre contient des personnages de séries, le livre est probablement 
    // attribué par erreur à l'auteur recherché
    if (containsSeriesCharacters) {
      return false;
    }
    
    return !containsTechnicalKeywords && 
           !containsUnwantedTypes && 
           !isSuspiciousTitle && 
           !isUnwantedFormat && 
           !isAudioBook &&
           !isTitleTooLong;
  });
}

export function isAuthorMatch(book: Book, searchQuery: string): boolean {
  if (!book.author || (Array.isArray(book.author) && book.author.length === 0)) {
    return false;
  }
  
  const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 1);
  
  // Si aucun terme significatif, considérer qu'il n'y a pas de correspondance
  if (searchTerms.length === 0) {
    return false;
  }
  
  // Normaliser les termes de recherche
  const normalizedSearchTerms = searchTerms.map(term => normalizeString(term));
  
  const authors = Array.isArray(book.author) ? book.author : [book.author];
  
  // Pour chaque auteur dans le livre
  return authors.some(author => {
    if (!author) return false;
    
    // Ignorer les auteurs génériques
    const authorLower = author.toLowerCase();
    if (authorLower.includes('collectif') || 
        authorLower.includes('divers') ||
        authorLower.includes('various') ||
        authorLower === 'auteurs' ||
        authorLower === 'authors' ||
        authorLower.length < 3) {
      return false;
    }
    
    // Normaliser l'auteur pour comparaison
    const normalizedAuthor = normalizeString(authorLower);
    
    // 1. Vérification exacte (match parfait)
    if (normalizedAuthor === normalizeString(searchQuery.toLowerCase())) {
      return true;
    }
    
    // 2. Vérification de l'ordre des termes dans le nom de l'auteur
    // Les termes doivent apparaître dans le bon ordre
    let remainingAuthorText = normalizedAuthor;
    let allTermsFoundInOrder = true;
    
    for (const term of normalizedSearchTerms) {
      const termIndex = remainingAuthorText.indexOf(term);
      if (termIndex === -1) {
        allTermsFoundInOrder = false;
        break;
      }
      remainingAuthorText = remainingAuthorText.substring(termIndex + term.length);
    }
    
    if (allTermsFoundInOrder) {
      return true;
    }
    
    // 3. Vérification plus stricte: chaque terme doit correspondre à un mot complet
    // ou au début/fin d'un mot dans le nom d'auteur
    const authorWords = normalizedAuthor.split(/\s+/);
    
    // Tous les termes de recherche doivent correspondre à au moins un mot de l'auteur
    const allTermsMatch = normalizedSearchTerms.every(searchTerm => {
      return authorWords.some(word => 
        word === searchTerm || 
        word.startsWith(searchTerm) || 
        word.endsWith(searchTerm)
      );
    });
    
    // 4. Vérification supplémentaire: pour les recherches avec prénom et nom
    if (normalizedSearchTerms.length >= 2 && allTermsMatch) {
      // Au moins le prénom et le nom doivent être présents
      const firstNameMatch = authorWords.some(word => 
        word.startsWith(normalizedSearchTerms[0]) || word === normalizedSearchTerms[0]
      );
      
      const lastNameMatch = authorWords.some(word => 
        word.startsWith(normalizedSearchTerms[normalizedSearchTerms.length - 1]) || 
        word === normalizedSearchTerms[normalizedSearchTerms.length - 1]
      );
      
      return firstNameMatch && lastNameMatch;
    }
    
    return allTermsMatch;
  });
}
