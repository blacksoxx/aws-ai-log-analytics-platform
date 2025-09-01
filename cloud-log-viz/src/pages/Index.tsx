import { useState, useEffect, useCallback } from 'react';
import { StatisticsCards } from '@/components/StatisticsCards';
import { LogLevelChart } from '@/components/LogLevelChart';
import { TimelineChart } from '@/components/TimelineChart';
import { SearchBar } from '@/components/SearchBar';
import { LogsTable } from '@/components/LogsTable';
import { Button } from '@/components/ui/button';
import { RefreshCw, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logService } from '@/services/api';
import { LogEntry } from '@/types/log';
import { calculateLogStats, getLogLevelChartData, getTimelineData } from '@/utils/logUtils';

const Index = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const fetchLogs = useCallback(async (showRefreshToast = false) => {
    try {
      setIsRefreshing(true);
      const data = await logService.fetchLogs();
      setLogs(data);
      setFilteredLogs(data);
      
      if (showRefreshToast) {
        toast({
          title: "Data refreshed",
          description: `Loaded ${data.length} log entries`,
        });
      }
    } catch (error) {
      toast({
        title: "Error loading logs",
        description: "Failed to fetch log data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [toast]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredLogs(logs);
      return;
    }

    try {
      const searchResults = await logService.searchLogs(query);
      setFilteredLogs(searchResults);
    } catch (error) {
      // Fallback to local search if API fails
      const filtered = logs.filter(log =>
        log.raw_message.toLowerCase().includes(query.toLowerCase()) ||
        log.summary.toLowerCase().includes(query.toLowerCase()) ||
        log.log_level.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredLogs(filtered);
    }
  }, [logs]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const stats = calculateLogStats(filteredLogs);
  const chartData = getLogLevelChartData(filteredLogs);
  const timelineData = getTimelineData(filteredLogs);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Log Analytics Dashboard</h1>
                <p className="text-muted-foreground">Real-time insights from your AWS infrastructure</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <SearchBar 
                onSearch={handleSearch} 
                isLoading={isRefreshing}
                placeholder="Search logs, messages, levels..."
              />
              <Button
                onClick={() => fetchLogs(true)}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Statistics Cards */}
        <section>
          <StatisticsCards stats={stats} isLoading={isLoading} />
        </section>

        {/* Charts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LogLevelChart data={chartData} isLoading={isLoading} />
          <TimelineChart data={timelineData} isLoading={isLoading} />
        </section>

        {/* Logs Table */}
        <section>
          <LogsTable logs={filteredLogs} isLoading={isLoading} />
        </section>
      </div>
    </div>
  );
};

export default Index;
