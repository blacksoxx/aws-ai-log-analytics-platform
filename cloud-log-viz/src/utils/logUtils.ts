import { LogEntry, LogStats, ChartDataPoint, TimelineDataPoint } from '@/types/log';
import { format, subHours } from 'date-fns';

export function calculateLogStats(logs: LogEntry[]): LogStats {
  const stats = logs.reduce(
    (acc, log) => {
      acc.total++;
      acc[log.log_level.toLowerCase() as keyof LogStats]++;
      if (log.processed) {
        acc.processed++;
      } else {
        acc.unprocessed++;
      }
      return acc;
    },
    {
      total: 0,
      errors: 0,
      warnings: 0,
      info: 0,
      debug: 0,
      processed: 0,
      unprocessed: 0,
    } as LogStats
  );

  return stats;
}

export function getLogLevelChartData(logs: LogEntry[]): ChartDataPoint[] {
  const stats = calculateLogStats(logs);
  
  const chartColors = {
    ERROR: 'hsl(var(--error))',
    WARNING: 'hsl(var(--warning))',
    INFO: 'hsl(var(--info))',
    DEBUG: 'hsl(var(--debug))',
  };

  return [
    { name: 'ERROR', value: stats.errors, color: chartColors.ERROR },
    { name: 'WARNING', value: stats.warnings, color: chartColors.WARNING },
    { name: 'INFO', value: stats.info, color: chartColors.INFO },
    { name: 'DEBUG', value: stats.debug, color: chartColors.DEBUG },
  ].filter(item => item.value > 0);
}

export function getTimelineData(logs: LogEntry[]): TimelineDataPoint[] {
  const now = new Date();
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = subHours(now, 11 - i);
    return {
      time: format(hour, 'HH:mm'),
      count: 0,
      hourStart: hour,
    };
  });

  logs.forEach(log => {
    const logTime = new Date(log.timestamp);
    const hourIndex = hours.findIndex(hour => {
      const hourEnd = new Date(hour.hourStart.getTime() + 60 * 60 * 1000);
      return logTime >= hour.hourStart && logTime < hourEnd;
    });
    
    if (hourIndex !== -1) {
      hours[hourIndex].count++;
    }
  });

  return hours.map(({ time, count }) => ({ time, count }));
}