import { supabase } from '@/integrations/supabase/client';

interface UserBookStats {
  user_email: string;
  user_id: string;
  book_count: number;
  book_titles: string[];
  book_authors: string[];
}

interface UserBookDetail {
  user_email: string;
  user_id: string;
  book_id: string;
  book_title: string;
  book_author: string;
  status: string | null;
}

interface UserStatistics {
  user_id: string;
  user_email: string;
  name: string | null;
  book_count: number;
  created_at: string | null;
  last_sign_in_at: string | null;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  user?: string;
  path?: string;
}

/**
 * Récupère les statistiques de tous les utilisateurs avec leurs livres
 * Cette fonction devrait être utilisée uniquement par les administrateurs
 */
export async function fetchAllUserStats(): Promise<UserBookStats[]> {
  try {
    const { data, error } = await supabase
      .from('user_books_stats')
      .select('*');

    if (error) {
      console.error('Erreur lors de la récupération des statistiques utilisateurs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de l\'appel aux statistiques utilisateurs:', error);
    return [];
  }
}

/**
 * Récupère les détails de tous les livres pour tous les utilisateurs
 * Cette fonction devrait être utilisée uniquement par les administrateurs
 */
export async function fetchAllUserBookDetails(): Promise<UserBookDetail[]> {
  try {
    const { data, error } = await supabase
      .from('user_books_detailed')
      .select('*');

    if (error) {
      console.error('Erreur lors de la récupération des détails des livres:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de l\'appel aux détails des livres:', error);
    return [];
  }
}

/**
 * Récupère les détails complets des livres depuis la vue books_complete_view
 */
export async function fetchBooksCompleteView() {
  try {
    const { data, error } = await supabase
      .from('books_complete_view')
      .select('*');

    if (error) {
      console.error('Erreur lors de la récupération des détails complets des livres:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de l\'appel aux détails complets des livres:', error);
    return [];
  }
}

/**
 * Récupère les statistiques de tous les utilisateurs incluant leurs informations
 * et le nombre de livres dans leur bibliothèque
 * Cette fonction devrait être utilisée uniquement par les administrateurs
 */
export async function fetchAllUsersStatistics(): Promise<UserStatistics[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_all_users_statistics');

    if (error) {
      console.error('Erreur lors de la récupération des statistiques globales:', error);
      return [];
    }

    return data as UserStatistics[] || [];
  } catch (error) {
    console.error('Erreur lors de l\'appel aux statistiques globales:', error);
    return [];
  }
}

/**
 * Récupère les logs système depuis la table system_logs
 * Cette fonction extrait les logs pertinents et les formate pour l'affichage
 */
export async function fetchSystemLogs(): Promise<SystemLog[]> {
  try {
    // Récupérer les logs depuis la table system_logs
    const { data, error } = await supabase
      .from('system_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Erreur lors de la récupération des logs système:', error);
      return getSimulatedLogs();
    }

    // Transformer les données en SystemLog
    const logs: SystemLog[] = data.map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      level: log.level as 'info' | 'warning' | 'error' | 'success',
      message: log.message,
      user: log.user_id ? log.user_id : undefined,
      path: log.path
    }));

    return logs.length > 0 ? logs : getSimulatedLogs();
  } catch (error) {
    console.error('Erreur lors de l\'appel aux logs système:', error);
    return getSimulatedLogs();
  }
}

/**
 * Ajoute un nouveau log système
 * Cette fonction peut être utilisée pour enregistrer des événements importants
 */
export async function addSystemLog(
  level: 'info' | 'warning' | 'error' | 'success',
  message: string,
  userId?: string,
  path?: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc('add_system_log', {
      p_level: level,
      p_message: message, 
      p_user_id: userId || null,
      p_path: path || null
    });

    if (error) {
      console.error('Erreur lors de l\'ajout du log système:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de l\'appel à la fonction d\'ajout de log:', error);
    return null;
  }
}

/**
 * Fournit des logs simulés en cas d'indisponibilité des logs réels
 * À utiliser uniquement pour la démonstration
 */
function getSimulatedLogs(): SystemLog[] {
  const now = new Date();
  
  const mockLogs: SystemLog[] = [
    {
      id: '1',
      timestamp: new Date(now.getTime() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      level: 'info',
      message: 'Utilisateur connecté',
      user: 'user@example.com',
      path: '/auth/login'
    },
    {
      id: '2',
      timestamp: new Date(now.getTime() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
      level: 'success',
      message: 'Mise à jour de la bibliothèque réussie',
      user: 'admin@example.com',
      path: '/api/library/update'
    },
    {
      id: '3',
      timestamp: new Date(now.getTime() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      level: 'warning',
      message: 'Tentative de connexion échouée',
      user: 'unknown@example.com',
      path: '/auth/login'
    },
    {
      id: '4',
      timestamp: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      level: 'error',
      message: 'Erreur de serveur: Impossible de se connecter à la base de données',
      path: '/api/database/connect'
    },
    {
      id: '5',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      level: 'info',
      message: 'Sauvegarde système automatique démarrée',
      path: '/system/backup'
    },
    {
      id: '6',
      timestamp: new Date(now.getTime() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
      level: 'success',
      message: 'Sauvegarde système terminée avec succès',
      path: '/system/backup'
    },
    {
      id: '7',
      timestamp: new Date(now.getTime() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      level: 'info',
      message: 'Nouvel utilisateur enregistré',
      user: 'newuser@example.com',
      path: '/auth/register'
    },
    {
      id: '8',
      timestamp: new Date(now.getTime() - 1000 * 60 * 180).toISOString(), // 3 hours ago
      level: 'warning',
      message: 'Utilisation élevée de la mémoire détectée',
      path: '/system/monitoring'
    },
    {
      id: '9',
      timestamp: new Date(now.getTime() - 1000 * 60 * 240).toISOString(), // 4 hours ago
      level: 'info',
      message: 'Mise à jour du système planifiée pour 00:00',
      path: '/system/update'
    },
    {
      id: '10',
      timestamp: new Date(now.getTime() - 1000 * 60 * 300).toISOString(), // 5 hours ago
      level: 'error',
      message: 'Erreur lors de l\'importation de livres: Format de fichier non valide',
      user: 'user@example.com',
      path: '/api/books/import'
    }
  ];

  return mockLogs;
}
