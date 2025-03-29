
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowDownUp, Check, Info, RefreshCw, Search, XCircle } from "lucide-react";
import { SystemLog } from "@/services/supabaseAdminStats";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface AdminLogsContentProps {
  logs: SystemLog[];
}

export const AdminLogsContent: React.FC<AdminLogsContentProps> = ({ logs }) => {
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredLogs = logs.filter(log => {
    const levelMatch = filterLevel === 'all' || log.level === filterLevel;
    const searchMatch = searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.user && log.user.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.path && log.path.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return levelMatch && searchMatch;
  }).sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'info':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Info</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Avertissement</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Erreur</Badge>;
      case 'success':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Succès</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      const date = parseISO(timestamp);
      return format(date, 'dd MMM yyyy HH:mm:ss', { locale: fr });
    } catch (error) {
      return timestamp;
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  };

  const handleRefresh = () => {
    // This would typically trigger a refetch
    // For now it's just a visual effect
    const refreshButton = document.getElementById('refresh-logs-button');
    if (refreshButton) {
      refreshButton.classList.add('animate-spin');
      setTimeout(() => {
        refreshButton.classList.remove('animate-spin');
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex w-full sm:w-2/3">
          <Input
            placeholder="Rechercher dans les logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-r-none"
          />
          <Button variant="secondary" className="rounded-l-none border border-l-0">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="w-full sm:w-1/3">
          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les niveaux</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Avertissement</SelectItem>
              <SelectItem value="error">Erreur</SelectItem>
              <SelectItem value="success">Succès</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''} trouvé{filteredLogs.length !== 1 ? 's' : ''}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleSortDirection}
            className="flex items-center gap-1"
          >
            <ArrowDownUp className="h-4 w-4" />
            {sortDirection === 'desc' ? 'Plus récents d\'abord' : 'Plus anciens d\'abord'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw id="refresh-logs-button" className="h-4 w-4" />
            Rafraîchir
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Date & Heure</TableHead>
              <TableHead className="w-[100px]">Niveau</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="w-[120px]">Utilisateur</TableHead>
              <TableHead className="w-[120px]">Chemin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">
                    {formatDate(log.timestamp)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getLevelIcon(log.level)}
                      {getLevelBadge(log.level)}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {log.message}
                  </TableCell>
                  <TableCell>
                    {log.user || '-'}
                  </TableCell>
                  <TableCell className="font-mono text-xs truncate max-w-[120px]">
                    {log.path || '-'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Aucun log correspondant aux critères de recherche.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
