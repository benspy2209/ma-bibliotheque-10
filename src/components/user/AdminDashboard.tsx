
import { useState, useEffect } from 'react';
import { 
  fetchAllUserStats, 
  fetchAllUserBookDetails, 
  fetchAllUsersStatistics,
  fetchBooksCompleteView,
  fetchSystemLogs
} from '@/services/supabaseAdminStats';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, BookOpen, TrendingUp, FileText, BarChart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { LoadingState } from '@/components/statistics/admin/LoadingState';
import { AdminAccessError } from '@/components/statistics/admin/AdminAccessError';
import { UsersTable } from '@/components/statistics/admin/UsersTable';
import { BookSummaryTable } from '@/components/statistics/admin/BookSummaryTable';
import { BookDetailsTable } from '@/components/statistics/admin/BookDetailsTable';
import { Badge } from "@/components/ui/badge";
import { AdminStatisticsContent } from '@/components/statistics/admin/AdminStatisticsContent';
import { AdminLogsContent } from '@/components/statistics/admin/AdminLogsContent';

export function AdminDashboard() {
  const [userStats, setUserStats] = useState([]);
  const [bookDetails, setBookDetails] = useState([]);
  const [userStatistics, setUserStatistics] = useState([]);
  const [booksComplete, setBooksComplete] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useSupabaseAuth();
  const isMobile = useIsMobile();
  
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
    
    const [stats, details, statistics, complete, logs] = await Promise.all([
      fetchAllUserStats(),
      fetchAllUserBookDetails(),
      fetchAllUsersStatistics(),
      fetchBooksCompleteView(),
      fetchSystemLogs()
    ]);
    
    setUserStats(stats);
    setBookDetails(details);
    setUserStatistics(statistics);
    setBooksComplete(complete);
    setSystemLogs(logs);
    setIsLoading(false);
  };

  // Stats calculées
  const totalUsers = userStatistics.length;
  const totalBooks = bookDetails.length;
  const completedBooks = bookDetails.filter(book => book.status === 'completed').length;
  const readingBooks = bookDetails.filter(book => book.status === 'reading').length;
  const toReadBooks = bookDetails.filter(book => !book.status || book.status === 'to-read').length;
  
  // Statistiques par mois 
  const booksByMonth = booksComplete.reduce((acc, book) => {
    if (book.completion_date) {
      const date = new Date(book.completion_date);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${month+1}`;
      
      if (!acc[key]) {
        acc[key] = [];
      }
      
      acc[key].push(book);
    }
    return acc;
  }, {});

  // Données pour les graphiques de statistiques
  const monthlyStats = Object.keys(booksByMonth).map(key => {
    const [year, month] = key.split('-');
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const monthName = `${monthNames[parseInt(month)-1]} ${year}`;
    return {
      month: monthName,
      booksRead: booksByMonth[key].length
    };
  }).sort((a, b) => {
    const monthA = a.month.split(' ');
    const monthB = b.month.split(' ');
    const yearA = parseInt(monthA[1]);
    const yearB = parseInt(monthB[1]);
    if (yearA !== yearB) return yearA - yearB;
    
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    return monthNames.indexOf(monthA[0]) - monthNames.indexOf(monthB[0]);
  });

  // Distribution des genres
  const genreDistribution = [
    { name: 'Fiction', value: 35 },
    { name: 'Non-fiction', value: 25 },
    { name: 'Sci-Fi', value: 15 },
    { name: 'Thriller', value: 10 },
    { name: 'Romance', value: 10 },
    { name: 'Autres', value: 5 }
  ];

  // Distribution du temps de lecture
  const readingTimeDistribution = [
    { name: 'Matin', value: 20 },
    { name: 'Après-midi', value: 15 },
    { name: 'Soir', value: 45 },
    { name: 'Nuit', value: 20 }
  ];

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
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Tableau de bord d'administration</CardTitle>
          </div>
          <CardDescription>
            Gérez votre bibliothèque et suivez les statistiques des utilisateurs
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Dashboard Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-muted/40 rounded-lg p-4 border">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Utilisateurs</p>
                  <h3 className="text-2xl font-bold">{totalUsers}</h3>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {userStatistics.filter(user => {
                  if (!user.last_sign_in_at) return false;
                  const date = new Date(user.last_sign_in_at);
                  const now = new Date();
                  const diff = now.getTime() - date.getTime();
                  const days = diff / (1000 * 3600 * 24);
                  return days <= 30;
                }).length} utilisateurs actifs au cours des 30 derniers jours
              </div>
            </div>
            
            <div className="bg-muted/40 rounded-lg p-4 border">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                  <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Livres</p>
                  <h3 className="text-2xl font-bold">{totalBooks}</h3>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="text-xs">{completedBooks} lus</Badge>
                <Badge variant="outline" className="text-xs">{readingBooks} en cours</Badge>
                <Badge variant="outline" className="text-xs">{toReadBooks} à lire</Badge>
              </div>
            </div>
            
            <div className="bg-muted/40 rounded-lg p-4 border">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Livres par mois</p>
                  <h3 className="text-2xl font-bold">
                    {Object.keys(booksByMonth).length > 0 
                      ? Math.round(totalBooks / Object.keys(booksByMonth).length) 
                      : 0}
                  </h3>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {Object.keys(booksByMonth).length} mois d'activité enregistrés
              </div>
            </div>
          </div>
          
          {/* Tabs for different data views */}
          <Tabs defaultValue="users">
            <TabsList className={`mb-6 ${isMobile ? 'flex-col w-full' : 'flex-wrap h-auto py-2'}`}>
              <TabsTrigger value="users" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="books" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                Livres
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                Statistiques
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Logs
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Liste des utilisateurs</CardTitle>
                  <CardDescription>
                    Tous les utilisateurs enregistrés dans la bibliothèque
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UsersTable userStatistics={userStatistics} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="books" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Résumé des livres</CardTitle>
                  <CardDescription>
                    Livres par utilisateur et auteurs favoris
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BookSummaryTable userStats={userStats} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Détails des livres</CardTitle>
                  <CardDescription>
                    Liste complète de tous les livres enregistrés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BookDetailsTable bookDetails={bookDetails} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistiques globales</CardTitle>
                  <CardDescription>
                    Métriques et tendances de lecture
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminStatisticsContent 
                    monthlyStats={monthlyStats}
                    genreDistribution={genreDistribution}
                    readingTimeDistribution={readingTimeDistribution}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="logs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Logs système</CardTitle>
                  <CardDescription>
                    Journaux d'activité et erreurs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminLogsContent logs={systemLogs || []} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
