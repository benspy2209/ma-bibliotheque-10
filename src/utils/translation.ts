
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

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=${encodeURIComponent(text)}`
    );

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    return data[0].map((item: any[]) => item[0]).join('');
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text if translation fails
    return text;
  }
}

function containsFrenchWords(text: string): boolean {
  const frenchWords = ['le', 'la', 'les', 'un', 'une', 'des', 'et', 'est', 'sont', 'dans'];
  const words = text.toLowerCase().split(/\s+/);
  return frenchWords.some(frenchWord => words.includes(frenchWord));
}
