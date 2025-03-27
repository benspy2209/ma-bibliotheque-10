import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Calendar, Filter, Search, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface UserStatistics {
  user_id: string;
  user_email: string;
  name: string | null;
  book_count: number;
  created_at: string | null;
  last_sign_in_at: string | null;
}

interface UsersTableProps {
  userStatistics: UserStatistics[];
}

type SortField = 'user_email' | 'name' | 'book_count' | 'created_at' | 'last_sign_in_at';
type SortDirection = 'asc' | 'desc';
type FilterType = 'all' | 'new' | 'active' | 'inactive';

export function UsersTable({ userStatistics }: UsersTableProps) {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4 ml-1" /> : 
      <ArrowDown className="h-4 w-4 ml-1" />;
  };

  // Calculate "new" users based on selected date or default to last 30 days
  const newUsersDate = useMemo(() => {
    if (selectedDate) {
      return selectedDate;
    }
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  }, [selectedDate]);

  // For checking users created on the exact same day as selectedDate
  const isSameDay = (dateStr: string | null, compareDate: Date): boolean => {
    if (!dateStr) return false;
    try {
      const date = new Date(dateStr);
      return date.getFullYear() === compareDate.getFullYear() && 
             date.getMonth() === compareDate.getMonth() && 
             date.getDate() === compareDate.getDate();
    } catch (error) {
      return false;
    }
  };

  // Apply filters and sorting
  const filteredSortedUsers = useMemo(() => {
    let filtered = [...userStatistics];
    
    // First apply filter by type
    switch (filterType) {
      case 'new':
        if (selectedDate) {
          // If a date is selected, show only users created on that exact day
          filtered = filtered.filter(user => 
            user.created_at && isSameDay(user.created_at, selectedDate)
          );
        } else {
          // Otherwise use the standard 30-day window
          filtered = filtered.filter(user => 
            user.created_at && new Date(user.created_at) >= newUsersDate
          );
        }
        break;
      case 'active':
        filtered = filtered.filter(user => 
          user.last_sign_in_at && 
          new Date(user.last_sign_in_at) >= newUsersDate
        );
        break;
      case 'inactive':
        filtered = filtered.filter(user => 
          !user.last_sign_in_at || 
          new Date(user.last_sign_in_at) < newUsersDate
        );
        break;
    }
    
    // Then apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.user_email.toLowerCase().includes(query) || 
        (user.name && user.name.toLowerCase().includes(query))
      );
    }
    
    // Finally sort
    return filtered.sort((a, b) => {
      let valA, valB;
      
      switch (sortField) {
        case 'user_email':
          valA = a.user_email.toLowerCase();
          valB = b.user_email.toLowerCase();
          break;
        case 'name':
          valA = (a.name || '').toLowerCase();
          valB = (b.name || '').toLowerCase();
          break;
        case 'book_count':
          valA = a.book_count;
          valB = b.book_count;
          break;
        case 'created_at':
          valA = a.created_at ? new Date(a.created_at).getTime() : 0;
          valB = b.created_at ? new Date(b.created_at).getTime() : 0;
          break;
        case 'last_sign_in_at':
          valA = a.last_sign_in_at ? new Date(a.last_sign_in_at).getTime() : 0;
          valB = b.last_sign_in_at ? new Date(b.last_sign_in_at).getTime() : 0;
          break;
        default:
          return 0;
      }
      
      const comparison = typeof valA === 'string' 
        ? valA.localeCompare(valB as string)
        : (valA as number) - (valB as number);
        
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [userStatistics, sortField, sortDirection, filterType, searchQuery, newUsersDate, selectedDate]);

  // Clear date filter
  const clearDateFilter = () => {
    setSelectedDate(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 mr-1 text-muted-foreground" />
          <Select 
            value={filterType} 
            onValueChange={(value) => setFilterType(value as FilterType)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filtrer par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les utilisateurs</SelectItem>
              <SelectItem value="new">Nouveaux</SelectItem>
              <SelectItem value="active">Actifs (30j)</SelectItem>
              <SelectItem value="inactive">Inactifs (30j)</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                <Calendar className="h-4 w-4 mr-2" /> 
                {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Choisir une date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {selectedDate && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearDateFilter} 
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Effacer la date
            </Button>
          )}
        </div>
      </div>

      {selectedDate && filterType === 'new' && (
        <div className="bg-muted/30 border rounded-lg p-2 flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span className="font-medium">Nouveaux utilisateurs inscrits le {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}</span>
          </div>
          <Badge>{filteredSortedUsers.length} utilisateur(s)</Badge>
        </div>
      )}

      <div className="overflow-auto max-h-[500px]">
        <Table>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:text-foreground"
                onClick={() => toggleSort('user_email')}
              >
                <div className="flex items-center">
                  Utilisateur
                  {getSortIcon('user_email')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-foreground"
                onClick={() => toggleSort('name')}
              >
                <div className="flex items-center">
                  Nom
                  {getSortIcon('name')}
                </div>
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer hover:text-foreground"
                onClick={() => toggleSort('book_count')}
              >
                <div className="flex items-center justify-end">
                  Livres
                  {getSortIcon('book_count')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-foreground"
                onClick={() => toggleSort('created_at')}
              >
                <div className="flex items-center">
                  Inscription
                  {getSortIcon('created_at')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-foreground"
                onClick={() => toggleSort('last_sign_in_at')}
              >
                <div className="flex items-center">
                  Dernière connexion
                  {getSortIcon('last_sign_in_at')}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSortedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Aucun utilisateur ne correspond à ces critères
                </TableCell>
              </TableRow>
            ) : (
              filteredSortedUsers.map((stat) => (
                <TableRow key={stat.user_id}>
                  <TableCell className="font-medium">{stat.user_email}</TableCell>
                  <TableCell>{stat.name || 'Non renseigné'}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{stat.book_count}</Badge>
                  </TableCell>
                  <TableCell>
                    {stat.created_at && (selectedDate && isSameDay(stat.created_at, selectedDate)) ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {formatDate(stat.created_at)} (Nouveau)
                      </Badge>
                    ) : (
                      formatDate(stat.created_at)
                    )}
                  </TableCell>
                  <TableCell>{formatDate(stat.last_sign_in_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
