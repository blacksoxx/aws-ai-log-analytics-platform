import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Clock, CheckCircle } from "lucide-react";
import { LogEntry } from "@/types/log";
import { format } from 'date-fns';

interface LogsTableProps {
  logs: LogEntry[];
  isLoading?: boolean;
}

type SortField = 'timestamp' | 'log_level' | 'processed';
type SortOrder = 'asc' | 'desc';

export function LogsTable({ logs, isLoading }: LogsTableProps) {
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedLogs = [...logs].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'timestamp':
        comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        break;
      case 'log_level':
        const levelOrder = { ERROR: 0, WARNING: 1, INFO: 2, DEBUG: 3 };
        comparison = levelOrder[a.log_level] - levelOrder[b.log_level];
        break;
      case 'processed':
        comparison = a.processed === b.processed ? 0 : a.processed ? -1 : 1;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const startIndex = (currentPage - 1) * logsPerPage;
  const paginatedLogs = sortedLogs.slice(startIndex, startIndex + logsPerPage);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  const getLogLevelBadge = (level: LogEntry['log_level']) => {
    const variants = {
      ERROR: 'destructive',
      WARNING: 'secondary',
      INFO: 'default',
      DEBUG: 'outline'
    } as const;

    const colors = {
      ERROR: 'text-error',
      WARNING: 'text-warning',
      INFO: 'text-info',
      DEBUG: 'text-debug'
    };

    return (
      <Badge variant={variants[level]} className={`${colors[level]} font-medium`}>
        {level}
      </Badge>
    );
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="h-auto p-0 text-left justify-start font-medium hover:bg-transparent"
    >
      {children}
      {sortField === field && (
        sortOrder === 'asc' ? 
          <ChevronUp className="ml-1 h-4 w-4" /> : 
          <ChevronDown className="ml-1 h-4 w-4" />
      )}
    </Button>
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Log Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          Log Entries
          <Badge variant="secondary" className="ml-auto">
            {logs.length} total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[140px]">
                  <SortButton field="timestamp">Timestamp</SortButton>
                </TableHead>
                <TableHead className="w-[100px]">
                  <SortButton field="log_level">Level</SortButton>
                </TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[120px]">Source</TableHead>
                <TableHead className="w-[100px]">
                  <SortButton field="processed">Status</SortButton>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.map((log) => (
                <TableRow 
                  key={log.log_id} 
                  className="hover:bg-muted/30 transition-colors border-b border-border/50"
                >
                  <TableCell className="font-mono text-xs">
                    {format(new Date(log.timestamp), 'MMM dd HH:mm:ss')}
                  </TableCell>
                  <TableCell>
                    {getLogLevelBadge(log.log_level)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-foreground line-clamp-1">
                        {log.summary}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {log.raw_message}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {log.source_file.split('/').pop()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {log.processed ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-success" />
                          <span className="text-xs text-success">Done</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 text-warning" />
                          <span className="text-xs text-warning">Pending</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + logsPerPage, logs.length)} of {logs.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}