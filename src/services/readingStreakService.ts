
import { supabase } from '@/integrations/supabase/client';

// Vérifier si l'utilisateur a déjà enregistré une lecture pour aujourd'hui
export async function hasReadToday() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const formattedDate = today.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('reading_streaks')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', formattedDate)
      .maybeSingle();

    if (error) {
      console.error('Erreur lors de la vérification de lecture:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Erreur lors de la vérification de lecture:', error);
    return false;
  }
}

// Marquer la journée comme lue
export async function markTodayAsRead() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const formattedDate = today.toISOString().split('T')[0];

    // Vérifier si une entrée existe déjà pour aujourd'hui
    const { data: existingEntry } = await supabase
      .from('reading_streaks')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', formattedDate)
      .maybeSingle();

    // Si une entrée existe déjà, ne rien faire
    if (existingEntry) {
      return { success: true, message: 'Déjà marqué comme lu aujourd\'hui' };
    }

    // Sinon, créer une nouvelle entrée
    const { error } = await supabase
      .from('reading_streaks')
      .insert({
        user_id: user.id,
        date: formattedDate,
        has_read: true
      });

    if (error) {
      console.error('Erreur lors de l\'enregistrement de la lecture:', error);
      throw error;
    }

    return { success: true, message: 'Journée marquée comme lue' };
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la lecture:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
}

// Obtenir le nombre de jours consécutifs de lecture
export async function getReadingStreak() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    // Pour debruijneb@gmail.com, calculer la streak depuis le 20/01/2025
    if (user.email === "debruijneb@gmail.com") {
      const today = new Date();
      const startDate = new Date(2025, 0, 20); // 20 janvier 2025
      
      // Calculer le nombre de jours entre ces deux dates
      const differenceInTime = today.getTime() - startDate.getTime();
      const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)) + 1; // +1 pour inclure le jour actuel
      
      return differenceInDays;
    }

    const { data, error } = await supabase
      .rpc('get_reading_streak', { p_user_id: user.id });

    if (error) {
      console.error('Erreur lors du calcul du streak:', error);
      return 0;
    }

    return data || 0;
  } catch (error) {
    console.error('Erreur lors du calcul du streak:', error);
    return 0;
  }
}
