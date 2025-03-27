
import { Badge } from "@/components/ui/badge";
import { BookmarkIcon, CheckCircleIcon, BookOpen, UserCircle, Users } from 'lucide-react';

interface AdminSummaryCardProps {
  totalUsers: number;
  totalBooks: number;
  completedBooks: number;
  readingBooks: number;
  toReadBooks: number;
}

export function AdminSummaryCard({
  totalUsers,
  totalBooks,
  completedBooks,
  readingBooks,
  toReadBooks
}: AdminSummaryCardProps) {
  return (
    <div className="mb-6 p-4 bg-muted/30 rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Users className="h-6 w-6 text-[#CC4153]" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nombre total d'utilisateurs</p>
            <h3 className="text-2xl font-bold">{totalUsers}</h3>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="font-normal">
            <BookmarkIcon className="h-3 w-3 mr-1 text-[#CC4153]" /> 
            {totalBooks} livres au total
          </Badge>
          <Badge variant="outline" className="font-normal">
            <CheckCircleIcon className="h-3 w-3 mr-1 text-[#CC4153]" /> 
            {completedBooks} livres lus
          </Badge>
          <Badge variant="outline" className="font-normal">
            <BookOpen className="h-3 w-3 mr-1 text-[#CC4153]" /> 
            {readingBooks} livres en cours
          </Badge>
          <Badge variant="outline" className="font-normal">
            <UserCircle className="h-3 w-3 mr-1 text-[#CC4153]" /> 
            {toReadBooks} livres à lire
          </Badge>
        </div>
      </div>
    </div>
  );
}
