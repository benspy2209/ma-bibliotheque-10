
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

export function ReadingTimeDistribution({ 
  readingTimeDistribution, 
  hasReadingTimeData,
  completedBooks 
}: ReadingTimeDistributionProps) {
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
    .sort((a, b) => (b.readingTimeDays || 0) - (a.readingTimeDays || 0));

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

      <Card>
        <CardHeader>
          <CardTitle>Livres par temps de lecture</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead className="text-right">Pages</TableHead>
                <TableHead className="text-right">Temps (jours)</TableHead>
                <TableHead className="text-right">Pages/jour</TableHead>
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
