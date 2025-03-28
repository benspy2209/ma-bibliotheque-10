
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface UserBookDetail {
  user_email: string;
  user_id: string;
  book_id: string;
  book_title: string;
  book_author: string;
  status: string | null;
}

interface BookDetailsTableProps {
  bookDetails: UserBookDetail[];
}

export function BookDetailsTable({ bookDetails }: BookDetailsTableProps) {
  return (
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
  );
}
