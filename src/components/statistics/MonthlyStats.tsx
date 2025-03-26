
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

type MonthData = {
  name: string;
  books: number;
  pages: number;
  date: Date;
};

interface MonthlyStatsProps {
  monthlyData: MonthData[];
}

export function MonthlyStats({ monthlyData }: MonthlyStatsProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Livres lus par mois</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={{ books: { color: "#8884d8", label: "Livres lus" }}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                  />
                  <Bar 
                    dataKey="books"
                    name="Livres"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Pages lues par mois</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={{ pages: { color: "#82ca9d", label: "Pages lues" }}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Bar 
                    dataKey="pages"
                    name="Pages"
                    fill="#82ca9d"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails mensuels</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mois</TableHead>
                <TableHead className="text-right">Livres</TableHead>
                <TableHead className="text-right">Pages</TableHead>
                <TableHead className="text-right">Pages/Livre</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyData.map((month) => (
                <TableRow key={month.name}>
                  <TableCell>{month.name}</TableCell>
                  <TableCell className="text-right">{month.books}</TableCell>
                  <TableCell className="text-right">{month.pages}</TableCell>
                  <TableCell className="text-right">
                    {month.books > 0 ? Math.round(month.pages / month.books) : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
