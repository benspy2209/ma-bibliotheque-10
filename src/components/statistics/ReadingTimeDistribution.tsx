
import { 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Book } from '@/types/book';
import { useState } from 'react';
import { 
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

type DistributionItem = {
  name: string;
  value: number;
  color: string;
};

interface ReadingTimeDistributionProps {
  readingTimeDistribution: DistributionItem[];
  hasReadingTimeData: boolean;
  completedBooks: Book[];
}

type SortField = 'title' | 'pages' | 'readingTime' | 'pagesPerDay';
type SortDirection = 'asc' | 'desc';

export function ReadingTimeDistribution({ 
  readingTimeDistribution, 
  hasReadingTimeData,
  completedBooks 
}: ReadingTimeDistributionProps) {
  const [sortField, setSortField] = useState<SortField>('readingTime');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Fonction pour gérer le tri
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Fonction pour afficher l'icône de tri appropriée
  const getSortIcon = (field: SortField) => {
    if (field === sortField) {
      return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    }
    return <ArrowUpDown className="h-4 w-4" />;
  };

  // Function to render custom label in pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    if (value === 0) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${name} (${value})`}
      </text>
    ) : null;
  };

  // Filter books with reading time data and sort by reading time (descending)
  const booksWithReadingTime = completedBooks
    .filter(book => book.readingTimeDays !== undefined)
    .sort((a, b) => {
      if (sortField === 'title') {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return sortDirection === 'asc' 
          ? titleA.localeCompare(titleB) 
          : titleB.localeCompare(titleA);
      } else if (sortField === 'pages') {
        const pagesA = a.numberOfPages || 0;
        const pagesB = b.numberOfPages || 0;
        return sortDirection === 'asc' ? pagesA - pagesB : pagesB - pagesA;
      } else if (sortField === 'pagesPerDay') {
        const pagesPerDayA = a.numberOfPages && a.readingTimeDays
          ? Math.round(a.numberOfPages / a.readingTimeDays)
          : 0;
        const pagesPerDayB = b.numberOfPages && b.readingTimeDays
          ? Math.round(b.numberOfPages / b.readingTimeDays)
          : 0;
        return sortDirection === 'asc' ? pagesPerDayA - pagesPerDayB : pagesPerDayB - pagesPerDayA;
      } else {
        // Par défaut, tri par temps de lecture
        return sortDirection === 'asc' 
          ? (a.readingTimeDays || 0) - (b.readingTimeDays || 0) 
          : (b.readingTimeDays || 0) - (a.readingTimeDays || 0);
      }
    });

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribution des temps de lecture</CardTitle>
            <CardDescription>Nombre de livres par durée de lecture</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {hasReadingTimeData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={readingTimeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {readingTimeDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                      />
                    ))}
                  </Pie>
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  <Tooltip formatter={(value, name) => [`${value} livre(s)`, name]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-center text-muted-foreground">
                  Aucune donnée de temps de lecture disponible.
                  <br />
                  Ajoutez le temps de lecture à vos livres pour voir les statistiques.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Temps de lecture total</CardTitle>
            <CardDescription>Répartition par livre</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {booksWithReadingTime.slice(0, 5).map(book => {
                const readingDays = book.readingTimeDays || 0;
                return (
                  <div key={book.id} className="space-y-2">
                    <div className="flex justify-between">
                      <p className="font-medium text-sm truncate" title={book.title}>
                        {book.title}
                      </p>
                      <span className="text-sm font-medium">
                        {readingDays} jour{readingDays !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(100, (readingDays / 0.3) * 10)} 
                      className="h-2"
                    />
                  </div>
                );
              })}
              
              {booksWithReadingTime.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Aucune donnée de temps de lecture disponible.
                  Ajoutez le temps de lecture à vos livres pour voir les statistiques.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Livres par temps de lecture</CardTitle>
          <CardDescription>
            Cliquez sur les en-têtes pour trier par différentes colonnes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    Titre {getSortIcon('title')}
                  </div>
                </TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('pages')}
                >
                  <div className="flex items-center justify-end">
                    Pages {getSortIcon('pages')}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('readingTime')}
                >
                  <div className="flex items-center justify-end">
                    Temps (jours) {getSortIcon('readingTime')}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('pagesPerDay')}
                >
                  <div className="flex items-center justify-end">
                    Pages/jour {getSortIcon('pagesPerDay')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {booksWithReadingTime.slice(0, 10).map((book) => {
                const pagesPerDay = book.numberOfPages && book.readingTimeDays
                  ? Math.round(book.numberOfPages / book.readingTimeDays)
                  : undefined;
                  
                return (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>
                      {Array.isArray(book.author) ? book.author[0] : book.author}
                    </TableCell>
                    <TableCell className="text-right">{book.numberOfPages || '-'}</TableCell>
                    <TableCell className="text-right">{book.readingTimeDays}</TableCell>
                    <TableCell className="text-right">
                      {pagesPerDay || '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
