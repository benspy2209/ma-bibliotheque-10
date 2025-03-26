
import { 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Bookmark } from "lucide-react";

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F',
  '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1'
];

type TopItem = {
  name: string;
  count: number;
};

interface AuthorsGenresStatsProps {
  topAuthors: TopItem[];
  topGenres: TopItem[];
}

export function AuthorsGenresStats({ topAuthors, topGenres }: AuthorsGenresStatsProps) {
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
        {name} ({value})
      </text>
    ) : null;
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Auteurs les plus lus</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topAuthors}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {topAuthors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value, name, props) => [`${value} livre(s)`, props.payload.name]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Genres les plus lus</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {topGenres && topGenres.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topGenres}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {topGenres.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value, name, props) => [`${value} livre(s)`, props.payload.name]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <Bookmark className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>Aucun genre de livre trouvé</p>
                  <p className="text-sm mt-1">Ajoutez des catégories à vos livres pour voir les statistiques</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 des auteurs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rang</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead className="text-right">Livres lus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topAuthors.map((author, index) => (
                <TableRow key={author.name}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{author.name}</TableCell>
                  <TableCell className="text-right">{author.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {topGenres && topGenres.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top 5 des genres</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rang</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead className="text-right">Livres</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topGenres.map((genre, index) => (
                  <TableRow key={genre.name}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{genre.name}</TableCell>
                    <TableCell className="text-right">{genre.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
