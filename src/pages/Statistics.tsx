import { useMemo } from 'react';
import { Book } from '@/types/book';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  Book as BookIcon, 
  BookOpen, 
  Library, 
  Calendar, 
  Clock, 
  TrendingUp,
  BookMarked,
  Languages,
  Award
} from 'lucide-react';
import { format, differenceInDays, parseISO, getYear, differenceInMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import NavBar from '@/components/NavBar';
import { loadBooks } from '@/services/supabaseBooks';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ReadingGoalsForm } from "@/components/statistics/ReadingGoalsForm";
import { useReadingGoals } from "@/hooks/use-reading-goals";
import { Footer } from "@/components/Footer";

import { Helmet } from 'react-helmet';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F',
  '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1'
];

export default function Statistics() {
  const { data: books = [], refetch: refetchBooks } = useQuery({
    queryKey: ['books'],
    queryFn: loadBooks,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
    gcTime: 0, // This replaces the old cacheTime property
  });

  const { data: readingGoals } = useReadingGoals();

  // Log books for debugging
  console.log('All books loaded:', books.length, 'books');
  console.log('Book statuses:', books.map(book => ({ id: book.id, title: book.title, status: book.status })));

  // Use a more explicit and safer filter for completed books
  const completedBooks = books.filter((book): book is Book => 
    book !== null && book.status === 'completed'
  );
  
  // Log completed books for debugging
  console.log('Completed books:', completedBooks.length, 'books');
  
  const readingBooks = books.filter((book): book is Book =>
    book !== null && book.status === 'reading'
  );

  const toReadBooks = books.filter((book): book is Book =>
    book !== null && (!book.status || book.status === 'to-read')
  );

  const stats = useMemo(() => {
    const totalBooks = completedBooks.length;
    
    const totalPages = completedBooks.reduce((sum, book) => {
      if (!book.numberOfPages) {
        return sum;
      }
      
      const pages = Number(book.numberOfPages);
      if (isNaN(pages)) {
        return sum;
      }
      
      return sum + pages;
    }, 0);
    
    const avgPagesPerBook = totalBooks > 0 ? Math.round(totalPages / totalBooks) : 0;

    let totalReadingDays = 0;
    let readingSpeed = 0;

    if (completedBooks.length > 0) {
      totalReadingDays = completedBooks.reduce((sum, book) => {
        if (book.readingTimeDays) {
          return sum + book.readingTimeDays;
        } else if (book.completionDate) {
          return sum + 14;
        }
        return sum;
      }, 0);
      
      readingSpeed = totalPages / (totalReadingDays || 1);
    }

    const totalReadingTime = totalPages / 30;

    const booksByMonth = completedBooks.reduce((acc, book) => {
      if (!book.completionDate) return acc;
      
      const monthKey = format(new Date(book.completionDate), 'MMMM yyyy', { locale: fr });
      if (!acc[monthKey]) {
        acc[monthKey] = {
          name: monthKey,
          books: 0,
          pages: 0,
          date: new Date(book.completionDate) 
        };
      }
      acc[monthKey].books += 1;
      
      const pages = Number(book.numberOfPages || 0);
      acc[monthKey].pages += !isNaN(pages) ? pages : 0;
      
      return acc;
    }, {} as Record<string, { name: string; books: number; pages: number; date: Date }>);

    const monthlyData = Object.values(booksByMonth)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(-6);

    const authorCounts = completedBooks.reduce((acc, book) => {
      const authors = Array.isArray(book.author) ? book.author : [book.author];
      
      authors.forEach(author => {
        if (!author) return;
        if (!acc[author]) {
          acc[author] = { name: author, count: 0 };
        }
        acc[author].count += 1;
      });
      
      return acc;
    }, {} as Record<string, { name: string; count: number }>);
    
    const topAuthors = Object.values(authorCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const languageCounts = completedBooks.reduce((acc, book) => {
      const languages = book.language || [];
      
      languages.forEach(lang => {
        if (!acc[lang]) {
          acc[lang] = { name: lang, count: 0 };
        }
        acc[lang].count += 1;
      });
      
      return acc;
    }, {} as Record<string, { name: string; count: number }>);
    
    const languageData = Object.values(languageCounts).sort((a, b) => b.count - a.count);

    const currentYear = getYear(new Date());
    const booksThisYear = completedBooks.filter(book => 
      book.completionDate && getYear(new Date(book.completionDate)) === currentYear
    ).length;

    const yearlyGoal = readingGoals.yearly_goal;
    const yearlyProgressPercentage = Math.min(100, (booksThisYear / yearlyGoal) * 100);

    const currentMonth = new Date();
    const booksThisMonth = completedBooks.filter(book => 
      book.completionDate && 
      differenceInMonths(currentMonth, new Date(book.completionDate)) === 0
    ).length;

    const monthlyGoal = readingGoals.monthly_goal;
    const monthlyProgressPercentage = Math.min(100, (booksThisMonth / monthlyGoal) * 100);

    const avgReadingTime = totalReadingDays / Math.max(1, completedBooks.length);
    
    const readingTimeDistribution = [
      { name: '1-7 jours', value: 0, color: '#8884d8' },
      { name: '8-14 jours', value: 0, color: '#82ca9d' },
      { name: '15-30 jours', value: 0, color: '#ffc658' },
      { name: '31+ jours', value: 0, color: '#ff8042' }
    ];
    
    completedBooks.forEach(book => {
      const days = book.readingTimeDays;
      if (days !== undefined) {
        if (days <= 7) {
          readingTimeDistribution[0].value++;
        } else if (days <= 14) {
          readingTimeDistribution[1].value++;
        } else if (days <= 30) {
          readingTimeDistribution[2].value++;
        } else {
          readingTimeDistribution[3].value++;
        }
      }
    });

    const filteredReadingTimeDistribution = readingTimeDistribution.filter(item => item.value > 0);

    return {
      totalBooks,
      totalPages,
      avgPagesPerBook,
      monthlyData,
      readingSpeed: readingSpeed.toFixed(1),
      totalReadingTime: totalReadingTime.toFixed(1),
      topAuthors,
      languageData,
      booksThisYear,
      yearlyGoal,
      yearlyProgressPercentage,
      booksThisMonth,
      monthlyGoal,
      monthlyProgressPercentage,
      readingBooks: readingBooks.length,
      toReadBooks: toReadBooks.length,
      totalReadingDays,
      avgReadingTime: avgReadingTime.toFixed(1),
      readingTimeDistribution,
      hasReadingTimeData: filteredReadingTimeDistribution.length > 0
    };
  }, [completedBooks, readingBooks, toReadBooks, readingGoals]);

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
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Statistiques | Ma Bibliothèque</title>
      </Helmet>
      
      <NavBar />
      
      <main className="container mx-auto py-6 space-y-8 flex-grow">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold">Statistiques de lecture</h1>
            <p className="text-muted-foreground">
              Analyse de vos habitudes de lecture
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total des livres lus</CardTitle>
                <BookIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBooks}</div>
                <p className="text-xs text-muted-foreground mt-1">Livres terminés</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pages lues</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPages}</div>
                <p className="text-xs text-muted-foreground mt-1">Total de pages</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jours de lecture</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalReadingDays}</div>
                <p className="text-xs text-muted-foreground mt-1">Temps total de lecture</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En cours</CardTitle>
                <BookMarked className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.readingBooks}</div>
                <p className="text-xs text-muted-foreground mt-1">Livres en cours de lecture</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">À lire</CardTitle>
                <Library className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.toReadBooks}</div>
                <p className="text-xs text-muted-foreground mt-1">Livres dans la file d'attente</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="monthly">Données mensuelles</TabsTrigger>
              <TabsTrigger value="authors">Auteurs & Langues</TabsTrigger>
              <TabsTrigger value="reading-time">Temps de lecture</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Moyenne par livre</CardTitle>
                    <CardDescription>Statistiques moyennes par livre</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Pages par livre
                        </p>
                        <p className="text-2xl font-bold">{stats.avgPagesPerBook}</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Vitesse de lecture
                        </p>
                        <p className="text-2xl font-bold">{stats.readingSpeed} <span className="text-sm font-normal">pages/jour</span></p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">Pages par jour en moyenne</p>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Jours par livre
                        </p>
                        <p className="text-2xl font-bold">{stats.avgReadingTime}</p>
                      </div>
                      <Clock className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="text-lg">Objectifs de lecture</CardTitle>
                      <CardDescription>Progression vers vos objectifs</CardDescription>
                    </div>
                    <ReadingGoalsForm 
                      yearlyGoal={readingGoals.yearly_goal}
                      monthlyGoal={readingGoals.monthly_goal}
                    />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Objectif annuel</p>
                        <p className="text-sm font-medium">
                          {stats.booksThisYear} / {stats.yearlyGoal} livres
                        </p>
                      </div>
                      <Progress value={stats.yearlyProgressPercentage} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Objectif mensuel</p>
                        <p className="text-sm font-medium">
                          {stats.booksThisMonth} / {stats.monthlyGoal} livres
                        </p>
                      </div>
                      <Progress value={stats.monthlyProgressPercentage} />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Temps de lecture</CardTitle>
                    <CardDescription>Estimation du temps passé à lire</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8 flex flex-col justify-center h-full">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Temps total estimé
                        </p>
                        <p className="text-2xl font-bold">{stats.totalReadingTime} h</p>
                      </div>
                      <Clock className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Basé sur une vitesse moyenne de 30 pages par heure
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-2 md:col-span-1">
                  <CardHeader>
                    <CardTitle>Livres lus par mois</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ChartContainer config={{ books: { color: "#8884d8", label: "Livres lus" }}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.monthlyData}>
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
                        <BarChart data={stats.monthlyData}>
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
                      {stats.monthlyData.map((month) => (
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
            </TabsContent>

            <TabsContent value="authors" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Auteurs les plus lus</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.topAuthors}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {stats.topAuthors.map((entry, index) => (
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
                    <CardTitle>Langues de lecture</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.languageData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {stats.languageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip formatter={(value, name, props) => [`${value} livre(s)`, props.payload.name]} />
                      </PieChart>
                    </ResponsiveContainer>
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
                      {stats.topAuthors.map((author, index) => (
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
            </TabsContent>

            <TabsContent value="reading-time" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribution des temps de lecture</CardTitle>
                    <CardDescription>Nombre de livres par durée de lecture</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    {stats.hasReadingTimeData ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.readingTimeDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                          >
                            {stats.readingTimeDistribution.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color || COLORS[index % COLORS.length]} 
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
                      {completedBooks
                        .filter(book => book.readingTimeDays !== undefined)
                        .sort((a, b) => (b.readingTimeDays || 0) - (a.readingTimeDays || 0))
                        .slice(0, 5)
                        .map(book => (
                          <div key={book.id} className="space-y-2">
                            <div className="flex justify-between">
                              <p className="font-medium text-sm truncate" title={book.title}>
                                {book.title}
                              </p>
                              <span className="text-sm font-medium">
                                {book.readingTimeDays} jour{book.readingTimeDays !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <Progress 
                              value={Math.min(100, (book.readingTimeDays || 0) / 0.3)} 
                              className="h-2"
                            />
                          </div>
                        ))}
                      
                      {completedBooks.filter(book => book.readingTimeDays !== undefined).length === 0 && (
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
                      {completedBooks
                        .filter(book => book.readingTimeDays !== undefined)
                        .slice(0, 10)
                        .map((book) => (
                          <TableRow key={book.id}>
                            <TableCell className="font-medium">{book.title}</TableCell>
                            <TableCell>
                              {Array.isArray(book.author) ? book.author[0] : book.author}
                            </TableCell>
                            <TableCell className="text-right">{book.numberOfPages || '-'}</TableCell>
                            <TableCell className="text-right">{book.readingTimeDays}</TableCell>
                            <TableCell className="text-right">
                              {book.numberOfPages && book.readingTimeDays
                                ? Math.round(book.numberOfPages / book.readingTimeDays)
                                : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
