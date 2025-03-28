
const DEEPL_FALLBACK_MAP: { [key: string]: string } = {
  'No description available': 'Aucune description disponible',
  'Unknown author': 'Auteur inconnu',
  'Publisher unknown': 'Éditeur inconnu'
};

export async function translateToFrench(text: string): Promise<string> {
  if (!text) return '';
  
  // Don't translate if already in French
  if (containsFrenchWords(text)) {
    return text;
  }

  // Remove reference links like [1], [2] etc.
  const cleanText = text.replace(/\[\d+\]/g, '');

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=fr&dt=t&q=${encodeURIComponent(cleanText)}`
    );

    if (!response.ok) {
      console.error('Translation error:', response.status);
      return text;
    }

    const data = await response.json();
    return data[0].map((item: any[]) => item[0]).join('');
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

function containsFrenchWords(text: string): boolean {
  // Mots français courants et déterminants
  const frenchWords = [
    'le', 'la', 'les', 'un', 'une', 'des', 
    'et', 'est', 'sont', 'dans',
    'ce', 'cette', 'ces', 'mon', 'ton', 'son',
    'par', 'pour', 'sur', 'avec'
  ];
  
  // Caractères spéciaux français
  const frenchChars = ['é', 'è', 'ê', 'à', 'ù', 'ç', 'ï', 'î'];
  
  const words = text.toLowerCase().split(/\s+/);
  
  // Vérifie la présence de mots français
  const hasFrenchWords = frenchWords.some(frenchWord => 
    words.includes(frenchWord)
  );
  
  // Vérifie la présence de caractères français
  const hasFrenchChars = frenchChars.some(char => 
    text.toLowerCase().includes(char)
  );
  
  return hasFrenchWords || hasFrenchChars;
}
