
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookIcon, BookOpen, Calendar, BookMarked, Library, ShoppingCart, CheckSquare } from "lucide-react";

interface StatsOverviewProps {
  totalBooks: number;
  totalPages: number;
  totalReadingDays: number;
  readingBooks: number;
  toReadBooks: number;
  purchasedBooks: number;  // Nouvelle propriété
  toBuyBooks: number;      // Nouvelle propriété
}

export function StatsOverview({
  totalBooks,
  totalPages,
  totalReadingDays,
  readingBooks,
  toReadBooks,
  purchasedBooks,  // Nouvelle propriété
  toBuyBooks       // Nouvelle propriété
}: StatsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total des livres lus</CardTitle>
          <BookIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBooks}</div>
          <p className="text-xs text-muted-foreground mt-1">Livres terminés</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pages lues</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPages}</div>
          <p className="text-xs text-muted-foreground mt-1">Total de pages</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jours de lecture</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReadingDays}</div>
          <p className="text-xs text-muted-foreground mt-1">Temps total de lecture</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En cours</CardTitle>
          <BookMarked className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{readingBooks}</div>
          <p className="text-xs text-muted-foreground mt-1">Livres en cours de lecture</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">À lire</CardTitle>
          <Library className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{toReadBooks}</div>
          <p className="text-xs text-muted-foreground mt-1">Livres dans la file d'attente</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Achetés</CardTitle>
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{purchasedBooks}</div>
          <p className="text-xs text-muted-foreground mt-1">Livres déjà achetés</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">À acheter</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{toBuyBooks}</div>
          <p className="text-xs text-muted-foreground mt-1">Livres à acquérir</p>
        </CardContent>
      </Card>
    </div>
  );
}
