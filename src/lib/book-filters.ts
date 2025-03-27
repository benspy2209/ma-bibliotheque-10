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

// Thèmes et sujets non littéraires à filtrer
const NON_LITERARY_SUBJECTS = [
  'graphologie', 'cuisine', 'comptines', 'guidebook', 'travel guide',
  'self-help', 'développement personnel', 'diététique', 'nutrition',
  'santé', 'médecine', 'yoga', 'méditation', 'jardinage', 'bricolage',
  'décoration', 'architecture', 'photographie', 'art', 'artisanat',
  'couture', 'tricot', 'crochet', 'peinture', 'dessin', 'sculpture'
];

// Add new exhibit/museum/art related keywords
const ART_EXHIBITION_KEYWORDS = [
  'exposition', 'exhibition', 'catalogue', 'catalog', 'museum', 'musée', 
  'gallery', 'galerie', 'matisse', 'picasso', 'centre pompidou', 'palais',
  'fondation', 'retrospective', 'rétrospective', 'oeuvres', 'œuvres',
  'peinture', 'peintures', 'painting', 'paintings', 'art', 'artist', 'artiste'
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
    const publisherString = (book.publishers || []).join(' ').toLowerCase();
    
    const allText = `${titleLower} ${authorString} ${subjectsString} ${descriptionLower} ${formatLower} ${publisherString}`;
    
    // Exclude exhibition catalogs and art books more aggressively
    const isArtExhibition = ART_EXHIBITION_KEYWORDS.some(keyword => 
      titleLower.includes(keyword.toLowerCase()) || 
      publisherString.includes(keyword.toLowerCase()) ||
      (book.description && descriptionLower.includes(keyword.toLowerCase()))
    );

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
    
    // Probably a museum or exhibition publication if publisher is a museum or art center
    const isMuseumPublication = publisherString.includes('musée') || 
                               publisherString.includes('museum') || 
                               publisherString.includes('centre') ||
                               publisherString.includes('galerie') ||
                               publisherString.includes('gallery') ||
                               publisherString.includes('foundation') ||
                               publisherString.includes('fondation');
    
    // Si c'est probablement un livre de fiction, nous voulons le garder quelles que soient les autres règles
    if (likelyFictionBook) {
      return !isAudioBook && !isArtExhibition && !isMuseumPublication; // Keep fiction but still exclude audio books and art exhibitions
    }
    
    // Vérification supplémentaire si le titre contient des personnages de BD/séries
    const containsSeriesCharacters = SERIES_CHARACTERS.some(character =>
      titleLower.includes(character.toLowerCase())
    );
    
    // Vérification si le livre contient des sujets non littéraires
    const containsNonLiterarySubjects = NON_LITERARY_SUBJECTS.some(subject =>
      allText.includes(subject.toLowerCase())
    );
    
    // If the title contains "exposition" or "exhibition" or the word "album", it's likely an art book
    if (titleLower.includes('exposition') || 
        titleLower.includes('exhibition') || 
        titleLower.includes('album') || 
        titleLower.includes('catalogue')) {
      return false;
    }
    
    return !containsTechnicalKeywords && 
           !containsUnwantedTypes && 
           !isSuspiciousTitle && 
           !isUnwantedFormat && 
           !isAudioBook &&
           !isTitleTooLong &&
           !containsNonLiterarySubjects &&
           !isArtExhibition &&
           !isMuseumPublication &&
           !containsSeriesCharacters;
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

// Enhanced version of isTitleExplicitMatch with stricter matching
export function isTitleExplicitMatch(book: Book, searchQuery: string): boolean {
  if (!book.title || !searchQuery) return false;
  
  const titleLower = book.title.toLowerCase();
  const searchLower = searchQuery.toLowerCase();
  
  // Normalize the title and the search
  const normalizedTitle = normalizeString(titleLower);
  const normalizedSearch = normalizeString(searchLower);
  
  // Stronger filtering for exhibition catalogs and art books
  if (titleLower.includes('exposition') || 
      titleLower.includes('exhibition') || 
      titleLower.includes('catalogue') || 
      titleLower.includes('matisse') ||
      titleLower.includes('centre pompidou') ||
      titleLower.includes('musée') || 
      titleLower.includes('album') ||
      titleLower.includes('/album')) {
    return false;
  }
  
  // Check for children's book patterns
  if (titleLower.includes('tom-tom') || 
      titleLower.includes('comics') || 
      titleLower.includes('bd') ||
      titleLower.includes('bande dessinée')) {
    return false;
  }
  
  // Check if the title contains exact words from the search query
  const titleWords = normalizedTitle.split(/\s+/);
  const searchWords = normalizedSearch.split(/\s+/).filter(word => word.length > 2);
  
  // For short search queries, be extremely strict
  if (searchWords.length <= 2) {
    // For a short search, we require that at least one word is exactly matched
    const hasExactMatch = searchWords.some(searchWord => 
      titleWords.includes(searchWord)
    );
    
    // And that the title doesn't look like an exhibition catalog
    const looksLikeExhibition = ART_EXHIBITION_KEYWORDS.some(keyword =>
      titleLower.includes(keyword.toLowerCase())
    );
    
    if (!hasExactMatch || looksLikeExhibition) {
      return false;
    }
  }
  
  // The title contains exactly the query string
  if (normalizedTitle.includes(normalizedSearch)) {
    // Even if the title includes the search query, we should ensure it's not a partial match
    // that could lead to false positives
    
    // If search is just one word, make sure it's a complete word in the title
    if (searchWords.length === 1 && searchWords[0].length < 5) {
      return titleWords.includes(searchWords[0]);
    }
    
    return true;
  }
  
  // For longer searches, we check if most words match and are in order
  if (searchWords.length > 2) {
    // We want at least 80% of the search words to be in the title
    const matchingWords = searchWords.filter(word => normalizedTitle.includes(word));
    const percentageThreshold = 0.9; // Increased from 0.8 to 0.9
    return matchingWords.length >= Math.ceil(searchWords.length * percentageThreshold);
  }
  
  return false;
}
