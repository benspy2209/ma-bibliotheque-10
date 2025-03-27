
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTable } from "./UsersTable";
import { BookSummaryTable } from "./BookSummaryTable";
import { BookDetailsTable } from "./BookDetailsTable";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserStatistics {
  user_id: string;
  user_email: string;
  name: string | null;
  book_count: number;
  created_at: string | null;
  last_sign_in_at: string | null;
}

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

interface AdminTabsContentProps {
  userStatistics: UserStatistics[];
  userStats: UserBookStats[];
  bookDetails: UserBookDetail[];
}

export function AdminTabsContent({
  userStatistics,
  userStats,
  bookDetails
}: AdminTabsContentProps) {
  const isMobile = useIsMobile();
  
  return (
    <Tabs defaultValue="users">
      <TabsList className={`mb-4 ${isMobile ? 'flex-wrap h-auto py-2' : ''}`}>
        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        <TabsTrigger value="summary">Résumé livres</TabsTrigger>
        <TabsTrigger value="details">Détails des livres</TabsTrigger>
      </TabsList>
      
      <TabsContent value="users">
        <UsersTable userStatistics={userStatistics} />
      </TabsContent>
      
      <TabsContent value="summary">
        <BookSummaryTable userStats={userStats} />
      </TabsContent>
      
      <TabsContent value="details">
        <BookDetailsTable bookDetails={bookDetails} />
      </TabsContent>
    </Tabs>
  );
}
