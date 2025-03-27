
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface UserBookStats {
  user_email: string;
  user_id: string;
  book_count: number;
  book_titles: string[];
  book_authors: string[];
}

interface BookSummaryTableProps {
  userStats: UserBookStats[];
}

export function BookSummaryTable({ userStats }: BookSummaryTableProps) {
  return (
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
  );
}
