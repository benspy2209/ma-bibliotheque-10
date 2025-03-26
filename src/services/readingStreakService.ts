
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

// Définir une date de début pour la série de lecture
export async function setStartDate(startDate: Date) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');

    // Formater la date
    startDate.setHours(0, 0, 0, 0);
    const formattedDate = startDate.toISOString().split('T')[0];
    
    // Vérifier si une entrée existe déjà pour cette date
    const { data: existingEntry } = await supabase
      .from('reading_streaks')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', formattedDate)
      .maybeSingle();

    // Si une entrée existe déjà, ne rien faire
    if (existingEntry) {
      return { success: true, message: 'Cette date est déjà marquée comme lue' };
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
      console.error('Erreur lors de la définition de la date de début:', error);
      throw error;
    }

    return { success: true, message: 'Date de début définie avec succès' };
  } catch (error) {
    console.error('Erreur lors de la définition de la date de début:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
}

// Ajouter des entrées pour toutes les dates entre la date de début et aujourd'hui
export async function fillDatesUntilToday(startDate: Date) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');

    // Formater la date de début
    startDate.setHours(0, 0, 0, 0);
    
    // Obtenir la date d'aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Vérification que la date de début est bien avant aujourd'hui
    if (startDate > today) {
      throw new Error('La date de début ne peut pas être dans le futur');
    }
    
    // Préparer les entrées à insérer
    const entries = [];
    const currentDate = new Date(startDate);
    
    // Créer une entrée pour chaque jour entre la date de début et aujourd'hui
    while (currentDate <= today) {
      const formattedDate = currentDate.toISOString().split('T')[0];
      
      entries.push({
        user_id: user.id,
        date: formattedDate,
        has_read: true
      });
      
      // Passer au jour suivant
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Insérer les entrées en masse, en ignorant les conflits
    if (entries.length > 0) {
      const { error } = await supabase
        .from('reading_streaks')
        .upsert(entries, { onConflict: 'user_id,date' });
        
      if (error) {
        console.error('Erreur lors du remplissage des dates:', error);
        throw error;
      }
    }
    
    return { success: true, message: 'Séries de lecture mises à jour avec succès' };
  } catch (error) {
    console.error('Erreur lors du remplissage des dates:', error);
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

// Obtenir la date de début de la série actuelle
export async function getStreakStartDate() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Récupérer la date la plus ancienne de la série actuelle
    const { data, error } = await supabase
      .from('reading_streaks')
      .select('date')
      .eq('user_id', user.id)
      .order('date', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération de la date de début:', error);
      return null;
    }

    return data?.date ? new Date(data.date) : null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la date de début:', error);
    return null;
  }
}
