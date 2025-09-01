export interface LogEntry {
  log_id: string;
  timestamp: string;
  log_level: 'ERROR' | 'WARNING' | 'INFO' | 'DEBUG';
  raw_message: string;
  summary: string;
  ai_summary: string;
  source_file: string;
  processed: boolean;
}

export interface LogStats {
  total: number;
  errors: number;
  warnings: number;
  info: number;
  debug: number;
  processed: number;
  unprocessed: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface TimelineDataPoint {
  time: string;
  count: number;
}