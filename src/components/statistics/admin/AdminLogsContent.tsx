
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, Info, Search, XCircle } from "lucide-react";

// Types pour les logs système
interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  user?: string;
  path?: string;
}

interface AdminLogsContentProps {
  logs: LogEntry[];
}

export const AdminLogsContent: React.FC<AdminLogsContentProps> = ({ logs }) => {
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = logs.filter(log => {
    const levelMatch = filterLevel === 'all' || log.level === filterLevel;
    const searchMatch = searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.user && log.user.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.path && log.path.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return levelMatch && searchMatch;
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
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', { 
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Journaux système</CardTitle>
          <CardDescription>
            Historique des activités et erreurs du système
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};
