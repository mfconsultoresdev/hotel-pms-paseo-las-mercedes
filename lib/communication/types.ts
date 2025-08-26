export interface CommunicationConfig {
  provider: 'sendgrid' | 'mailgun' | 'twilio' | 'aws-ses' | 'nodemailer';
  isActive: boolean;
  isTestMode: boolean;
  apiKey: string;
  secretKey?: string;
  endpoint?: string;
  credentials: Record<string, any>;
  templates: Record<string, string>;
  defaultFrom: string;
  defaultReplyTo?: string;
}

export interface EmailRequest {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  from?: string;
  replyTo?: string;
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  templateData?: Record<string, any>;
  attachments?: EmailAttachment[];
  priority?: 'low' | 'normal' | 'high';
  scheduledAt?: Date;
  metadata?: Record<string, any>;
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
  encoding?: string;
  cid?: string; // Content ID for inline images
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  message: string;
  error?: string;
  sentAt: Date;
  deliveredTo: string[];
  failedTo?: string[];
}

export interface SMSRequest {
  to: string | string[];
  from?: string;
  message: string;
  template?: string;
  templateData?: Record<string, any>;
  scheduledAt?: Date;
  priority?: 'low' | 'normal' | 'high';
  metadata?: Record<string, any>;
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  message: string;
  error?: string;
  sentAt: Date;
  deliveredTo: string[];
  failedTo?: string[];
  cost?: number;
  currency?: string;
}

export interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  category: 'reservation' | 'confirmation' | 'cancellation' | 'reminder' | 'marketing' | 'system';
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunicationLog {
  id: string;
  type: 'email' | 'sms';
  provider: string;
  request: EmailRequest | SMSRequest;
  response: EmailResponse | SMSResponse;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  retryCount: number;
  lastRetryAt?: Date;
  createdAt: Date;
  deliveredAt?: Date;
  metadata?: Record<string, any>;
}

export interface BulkCommunicationRequest {
  type: 'email' | 'sms';
  recipients: Array<{
    email?: string;
    phone?: string;
    name?: string;
    customData?: Record<string, any>;
  }>;
  template: string;
  templateData?: Record<string, any>;
  scheduledAt?: Date;
  priority?: 'low' | 'normal' | 'high';
  metadata?: Record<string, any>;
}

export interface BulkCommunicationResponse {
  success: boolean;
  message: string;
  totalRecipients: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  batchId: string;
  estimatedDeliveryTime?: Date;
  cost?: number;
  currency?: string;
}

export interface CommunicationStats {
  period: string;
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalBounced: number;
  deliveryRate: number;
  bounceRate: number;
  openRate?: number;
  clickRate?: number;
  cost: number;
  currency: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  provider: string;
  data: Record<string, any>;
  timestamp: Date;
  processed: boolean;
  processedAt?: Date;
}

export interface NotificationPreferences {
  userId: string;
  email: {
    enabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
    categories: string[];
  };
  sms: {
    enabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
    categories: string[];
  };
  push: {
    enabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
    categories: string[];
  };
  updatedAt: Date;
}

export interface CommunicationQueue {
  id: string;
  type: 'email' | 'sms';
  priority: number;
  request: EmailRequest | SMSRequest;
  retryCount: number;
  maxRetries: number;
  scheduledAt: Date;
  createdAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  error?: string;
  processedAt?: Date;
}

export interface CommunicationSettings {
  defaultProvider: string;
  fallbackProviders: string[];
  retryPolicy: {
    maxRetries: number;
    retryDelay: number; // minutes
    exponentialBackoff: boolean;
  };
  rateLimiting: {
    maxPerMinute: number;
    maxPerHour: number;
    maxPerDay: number;
  };
  templates: {
    defaultLanguage: string;
    supportedLanguages: string[];
    autoTranslation: boolean;
  };
  monitoring: {
    enableLogging: boolean;
    enableMetrics: boolean;
    alertThresholds: {
      failureRate: number;
      deliveryRate: number;
    };
  };
}

