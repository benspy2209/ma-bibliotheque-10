
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UserStatistics {
  user_id: string;
  user_email: string;
  name: string | null;
  book_count: number;
  created_at: string | null;
  last_sign_in_at: string | null;
}

interface UsersTableProps {
  userStatistics: UserStatistics[];
}

export function UsersTable({ userStatistics }: UsersTableProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  return (
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
  );
}
