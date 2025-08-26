export interface AnalyticsConfig {
  provider: 'google_analytics' | 'mixpanel' | 'amplitude' | 'hotjar' | 'custom' | 'local';
  isActive: boolean;
  isTestMode: boolean;
  apiKey: string;
  secretKey?: string;
  endpoint: string;
  credentials: Record<string, any>;
  trackingId?: string;
  syncInterval: number; // minutes
  lastSync?: Date;
}

export interface AnalyticsEvent {
  id: string;
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
  properties: Record<string, any>;
  metadata: Record<string, any>;
}

export interface PageView {
  id: string;
  url: string;
  title: string;
  referrer?: string;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  duration?: number; // seconds
  properties: Record<string, any>;
}

export interface UserSession {
  id: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  pageViews: number;
  events: number;
  device: {
    type: 'desktop' | 'tablet' | 'mobile';
    browser: string;
    browserVersion: string;
    os: string;
    osVersion: string;
    screenResolution: string;
    userAgent: string;
  };
  location: {
    country: string;
    region: string;
    city: string;
    ipAddress: string;
    timezone: string;
  };
  properties: Record<string, any>;
}

export interface UserProfile {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  location: {
    country: string;
    region: string;
    city: string;
    timezone: string;
  };
  preferences: Record<string, any>;
  segments: string[];
  properties: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  lastSeen: Date;
}

export interface ConversionGoal {
  id: string;
  name: string;
  type: 'page_view' | 'event' | 'custom' | 'funnel';
  target: string;
  value: number;
  currency: string;
  isActive: boolean;
  description?: string;
  conditions: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Funnel {
  id: string;
  name: string;
  description?: string;
  steps: FunnelStep[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FunnelStep {
  id: string;
  name: string;
  type: 'page_view' | 'event' | 'custom';
  target: string;
  order: number;
  conditions: Record<string, any>;
  conversionRate?: number;
}

export interface Cohort {
  id: string;
  name: string;
  definition: string;
  criteria: Record<string, any>;
  users: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Metric {
  id: string;
  name: string;
  description?: string;
  type: 'count' | 'sum' | 'average' | 'percentage' | 'custom';
  formula: string;
  unit?: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  isPublic: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardLayout {
  type: 'grid' | 'flexible';
  columns: number;
  rows: number;
  cellSize: {
    width: number;
    height: number;
  };
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'list' | 'iframe';
  title: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config: Record<string, any>;
  dataSource: string;
  refreshInterval?: number; // seconds
}

export interface DashboardFilter {
  id: string;
  name: string;
  type: 'date_range' | 'dropdown' | 'text' | 'number_range' | 'boolean';
  field: string;
  defaultValue?: any;
  options?: any[];
  isRequired: boolean;
}

export interface Report {
  id: string;
  name: string;
  description?: string;
  type: 'scheduled' | 'on_demand' | 'real_time';
  template: string;
  parameters: Record<string, any>;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
    timezone: string;
  };
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv' | 'html';
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataExport {
  id: string;
  name: string;
  description?: string;
  query: string;
  parameters: Record<string, any>;
  format: 'json' | 'csv' | 'excel' | 'xml';
  filters: Record<string, any>;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    timezone: string;
  };
  destination: {
    type: 'email' | 'ftp' | 's3' | 'webhook';
    config: Record<string, any>;
  };
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Alert {
  id: string;
  name: string;
  description?: string;
  condition: string;
  threshold: number;
  operator: 'greater_than' | 'less_than' | 'equals' | 'not_equals' | 'contains';
  frequency: 'immediate' | 'hourly' | 'daily';
  channels: Array<'email' | 'sms' | 'push' | 'webhook'>;
  recipients: string[];
  isActive: boolean;
  lastTriggered?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsQuery {
  metrics: string[];
  dimensions?: string[];
  filters?: Record<string, any>;
  sort?: Array<{
    field: string;
    direction: 'asc' | 'desc';
  }>;
  limit?: number;
  offset?: number;
  dateRange: {
    start: Date;
    end: Date;
  };
  granularity?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export interface AnalyticsResponse {
  success: boolean;
  data: any;
  metadata: {
    totalRows: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    queryTime: number; // milliseconds
  };
  error?: string;
}

export interface AnalyticsSettings {
  tracking: {
    enabled: boolean;
    anonymizeIp: boolean;
    respectDnt: boolean;
    cookieConsent: boolean;
    sessionTimeout: number; // minutes
  };
  privacy: {
    dataRetention: number; // days
    anonymizeData: boolean;
    allowExport: boolean;
    gdprCompliant: boolean;
  };
  integrations: {
    googleAnalytics: boolean;
    facebookPixel: boolean;
    hotjar: boolean;
    customScripts: string[];
  };
  notifications: {
    email: boolean;
    slack: boolean;
    webhook: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
  };
  performance: {
    cacheEnabled: boolean;
    cacheDuration: number; // minutes
    maxConcurrentQueries: number;
    queryTimeout: number; // seconds
  };
}

export interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'stream';
  connection: Record<string, any>;
  schema: Record<string, any>;
  refreshInterval: number; // minutes
  lastRefresh?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataPipeline {
  id: string;
  name: string;
  description?: string;
  source: string;
  destination: string;
  transformations: Array<{
    type: string;
    config: Record<string, any>;
  }>;
  schedule: {
    frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
    time?: string;
    timezone: string;
  };
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
  status: 'idle' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

