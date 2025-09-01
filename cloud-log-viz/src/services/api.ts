import axios from 'axios';
import { LogEntry } from '@/types/log';

// Mock data for testing
const mockLogs: LogEntry[] = [
  {
    log_id: "log-001",
    timestamp: "2025-01-31T14:20:00Z",
    log_level: "ERROR",
    raw_message: "Nginx timeout on port 80",
    summary: "Nginx web server timeout occurred on port 80",
    ai_summary: "Critical server timeout detected on main web service",
    source_file: "logs/nginx-errors.log",
    processed: true
  },
  {
    log_id: "log-002",
    timestamp: "2025-01-31T14:15:00Z",
    log_level: "WARNING",
    raw_message: "High memory usage detected: 85%",
    summary: "Memory usage approaching threshold",
    ai_summary: "System memory consumption is elevated but within acceptable limits",
    source_file: "logs/system.log",
    processed: true
  },
  {
    log_id: "log-003",
    timestamp: "2025-01-31T14:10:00Z",
    log_level: "INFO",
    raw_message: "User authentication successful for user@example.com",
    summary: "Successful user login",
    ai_summary: "Normal user authentication flow completed successfully",
    source_file: "logs/auth.log",
    processed: false
  },
  {
    log_id: "log-004",
    timestamp: "2025-01-31T14:05:00Z",
    log_level: "DEBUG",
    raw_message: "Database query execution time: 45ms",
    summary: "Database performance metric",
    ai_summary: "Database query performed within normal response time parameters",
    source_file: "logs/db.log",
    processed: true
  },
  {
    log_id: "log-005",
    timestamp: "2025-01-31T14:00:00Z",
    log_level: "ERROR",
    raw_message: "Failed to connect to external API: connection refused",
    summary: "External API connection failure",
    ai_summary: "External service integration is currently unavailable",
    source_file: "logs/api.log",
    processed: false
  },
  {
    log_id: "log-006",
    timestamp: "2025-01-31T13:55:00Z",
    log_level: "WARNING",
    raw_message: "SSL certificate expires in 30 days",
    summary: "SSL certificate renewal needed",
    ai_summary: "Security certificate requires renewal within one month",
    source_file: "logs/security.log",
    processed: true
  }
];

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const logService = {
  async fetchLogs(): Promise<LogEntry[]> {
    try {
      const response = await api.get('/logs');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      // Fallback to mock data on error
      return mockLogs;
    }
  },

  async fetchLogById(id: string, timestamp: string): Promise<LogEntry> {
    try {
      const response = await api.get(`/logs/${id}?timestamp=${timestamp}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch log:', error);
      throw error;
    }
  },

  async searchLogs(query: string): Promise<LogEntry[]> {
    try {
      const response = await api.get(`/logs/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Failed to search logs:', error);
      return [];
    }
  }
};