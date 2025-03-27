
import { useState, useEffect } from 'react';
import { 
  fetchAllUserStats, 
  fetchAllUserBookDetails, 
  fetchAllUsersStatistics 
} from '@/services/supabaseAdminStats';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { AlertCircle, Users, BookOpen, UserCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

export function AdminUsersStats() {
  const [userStats, setUserStats] = useState<UserBookStats[]>([]);
  const [bookDetails, setBookDetails] = useState<UserBookDetail[]>([]);
  const [userStatistics, setUserStatistics] = useState<UserStatistics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useSupabaseAuth();
  
  useEffect(() => {
    // Vérifier si l'utilisateur est admin (remplacer par votre logique d'admin)
    const checkIfAdmin = () => {
      // Pour des raisons de démonstration, on considère un utilisateur spécifique comme admin
      // Dans un environnement de production, utilisez un système de rôles approprié
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
    
    setUserStats(stats);
    setBookDetails(details);
    setUserStatistics(statistics);
    setIsLoading(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">Chargement des statistiques...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-40 space-y-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground text-center">Accès restreint. Vous devez être administrateur pour voir ces statistiques.</p>
          </div>
        </CardContent>
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
        <Tabs defaultValue="users">
          <TabsList className="mb-4">
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="summary">Résumé livres</TabsTrigger>
            <TabsTrigger value="details">Détails des livres</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <div className="overflow-auto max-h-[500px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead className="text-right">Livres</TableHead>
                    <TableHead>Inscription</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userStatistics.map((stat) => (
                    <TableRow key={stat.user_id}>
                      <TableCell className="font-medium">{stat.user_email}</TableCell>
                      <TableCell>{stat.name || 'Non renseigné'}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{stat.book_count}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(stat.created_at)}</TableCell>
                      <TableCell>{formatDate(stat.last_sign_in_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="summary">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead className="text-right">Nombre de livres</TableHead>
                  <TableHead>Auteurs favoris</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userStats.map((stat) => (
                  <TableRow key={stat.user_id}>
                    <TableCell className="font-medium">{stat.user_email}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{stat.book_count}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {stat.book_authors.slice(0, 3).map((author, index) => (
                          <Badge key={index} variant="outline">{author}</Badge>
                        ))}
                        {stat.book_authors.length > 3 && (
                          <Badge variant="outline">+{stat.book_authors.length - 3}</Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="overflow-auto max-h-[500px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookDetails.map((book) => (
                    <TableRow key={book.book_id}>
                      <TableCell className="font-medium">{book.user_email}</TableCell>
                      <TableCell>{book.book_title}</TableCell>
                      <TableCell>{book.book_author}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            book.status === 'completed' ? 'success' : 
                            book.status === 'reading' ? 'default' : 
                            'secondary'
                          }
                        >
                          {book.status === 'completed' ? 'Lu' : 
                           book.status === 'reading' ? 'En cours' : 
                           'À lire'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
