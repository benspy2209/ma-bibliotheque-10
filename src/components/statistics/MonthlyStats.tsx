
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>Livres lus par mois</CardTitle>
          </CardHeader>
          <CardContent className="h-[240px] sm:h-[300px] overflow-hidden">
            <ChartContainer config={{ books: { color: "#8884d8", label: "Livres lus" }}}>
              <ResponsiveContainer width="99%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: isMobile ? -25 : 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name"
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    interval={isMobile ? 1 : 0}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                    scale="point"
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis 
                    width={isMobile ? 25 : 40}
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                  />
                  <Bar 
                    dataKey="books"
                    name="Livres"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={isMobile ? 15 : 25}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>Pages lues par mois</CardTitle>
          </CardHeader>
          <CardContent className="h-[240px] sm:h-[300px] overflow-hidden">
            <ChartContainer config={{ pages: { color: "#82ca9d", label: "Pages lues" }}}>
              <ResponsiveContainer width="99%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: isMobile ? -25 : 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name"
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    interval={isMobile ? 1 : 0}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                    scale="point"
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis 
                    width={isMobile ? 25 : 40}
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Bar 
                    dataKey="pages"
                    name="Pages"
                    fill="#82ca9d"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={isMobile ? 15 : 25}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>Détails mensuels</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[500px]">
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
          </div>
        </CardContent>
      </Card>
    </>
  );
}
