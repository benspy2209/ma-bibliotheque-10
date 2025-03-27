
import { useState, useEffect } from 'react';
import { 
  fetchAllUserStats, 
  fetchAllUserBookDetails, 
  fetchAllUsersStatistics 
} from '@/services/supabaseAdminStats';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

// Import the refactored components
import { AdminSummaryCard } from './admin/AdminSummaryCard';
import { AdminTabsContent } from './admin/AdminTabsContent';
import { AdminAccessError } from './admin/AdminAccessError';
import { LoadingState } from './admin/LoadingState';

export function AdminUsersStats() {
  const [userStats, setUserStats] = useState([]);
  const [bookDetails, setBookDetails] = useState([]);
  const [userStatistics, setUserStatistics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useSupabaseAuth();
  
  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    const checkIfAdmin = () => {
      if (user?.email === 'debruijneb@gmail.com') {
        setIsAdmin(true);
        loadData();
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    checkIfAdmin();
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    
    const stats = await fetchAllUserStats();
    const details = await fetchAllUserBookDetails();
    const statistics = await fetchAllUsersStatistics();
    
    // Tri des détails pour voir le problème potentiel
    const sortedDetails = [...details].sort((a, b) => {
      if (a.user_email < b.user_email) return -1;
      if (a.user_email > b.user_email) return 1;
      return 0;
    });
    
    console.log('Détails des livres triés par utilisateur:', sortedDetails);
    
    setUserStats(stats);
    setBookDetails(details);
    setUserStatistics(statistics);
    setIsLoading(false);
  };

  // Calcul du nombre total d'utilisateurs
  const totalUsers = userStatistics.length;
  
  // Calcul du nombre total de livres
  const totalBooks = bookDetails.length;
  
  // Calcul du nombre de livres par statut
  const completedBooks = bookDetails.filter(book => book.status === 'completed').length;
  const readingBooks = bookDetails.filter(book => book.status === 'reading').length;
  const toReadBooks = bookDetails.filter(book => !book.status || book.status === 'to-read').length;

  if (isLoading) {
    return (
      <Card>
        <LoadingState />
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Card>
        <AdminAccessError />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <span>Statistiques par utilisateur</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AdminSummaryCard 
          totalUsers={totalUsers}
          totalBooks={totalBooks}
          completedBooks={completedBooks}
          readingBooks={readingBooks}
          toReadBooks={toReadBooks}
        />
        
        <AdminTabsContent 
          userStatistics={userStatistics}
          userStats={userStats}
          bookDetails={bookDetails}
        />
      </CardContent>
    </Card>
  );
}
