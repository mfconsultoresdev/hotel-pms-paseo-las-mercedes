import { createModuleLogger } from './logger';
import { HealthCheckResult } from './health-checker';

const logger = createModuleLogger('alert-manager');

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  source: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  metadata?: any;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: (data: any) => boolean;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  enabled: boolean;
  cooldown: number; // minutes
  lastTriggered?: Date;
}

export interface AlertChannel {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'webhook' | 'slack' | 'discord';
  config: any;
  enabled: boolean;
}

export class AlertManager {
  private alerts: Map<string, Alert> = new Map();
  private rules: Map<string, AlertRule> = new Map();
  private channels: Map<string, AlertChannel> = new Map();
  private isRunning = false;

  constructor() {
    this.addDefaultRules();
    this.addDefaultChannels();
  }

  // Add a new alert rule
  addRule(rule: AlertRule) {
    this.rules.set(rule.id, rule);
    logger.info(`Added alert rule: ${rule.name}`);
  }

  // Add a new alert channel
  addChannel(channel: AlertChannel) {
    this.channels.set(channel.id, channel);
    logger.info(`Added alert channel: ${channel.name}`);
  }

  // Add default alert rules
  private addDefaultRules() {
    // Database connection issues
    this.addRule({
      id: 'db-connection-failed',
      name: 'Database Connection Failed',
      condition: (data: HealthCheckResult) => 
        data.name === 'database' && data.status === 'unhealthy',
      severity: 'critical',
      message: 'Database connection has failed. This is a critical issue that requires immediate attention.',
      enabled: true,
      cooldown: 5,
    });

    // High memory usage
    this.addRule({
      id: 'high-memory-usage',
      name: 'High Memory Usage',
      condition: (data: HealthCheckResult) => 
        data.name === 'system-resources' && 
        data.details?.memoryUsage && 
        parseInt(data.details.memoryUsage) > 90,
      severity: 'warning',
      message: 'Memory usage is above 90%. Consider investigating memory leaks or scaling the application.',
      enabled: true,
      cooldown: 10,
    });

    // Payment gateway failures
    this.addRule({
      id: 'payment-gateway-failed',
      name: 'Payment Gateway Failed',
      condition: (data: HealthCheckResult) => 
        data.name === 'external-apis' && 
        data.details?.paymentGateways?.some((pg: any) => pg.status === 'unhealthy'),
      severity: 'critical',
      message: 'One or more payment gateways are experiencing issues. This may affect revenue generation.',
      enabled: true,
      cooldown: 5,
    });

    // OTA integration failures
    this.addRule({
      id: 'ota-integration-failed',
      name: 'OTA Integration Failed',
      condition: (data: HealthCheckResult) => 
        data.name === 'external-apis' && 
        data.details?.otaIntegrations?.some((ota: any) => ota.status === 'unhealthy'),
      severity: 'warning',
      message: 'One or more OTA integrations are experiencing issues. This may affect booking synchronization.',
      enabled: true,
      cooldown: 15,
    });

    // API response time degradation
    this.addRule({
      id: 'api-slow-response',
      name: 'API Slow Response',
      condition: (data: any) => 
        data.type === 'api-performance' && 
        data.responseTime > 2000, // 2 seconds
      severity: 'warning',
      message: 'API response times are degrading. This may affect user experience.',
      enabled: true,
      cooldown: 10,
    });

    // Error rate threshold
    this.addRule({
      id: 'high-error-rate',
      name: 'High Error Rate',
      condition: (data: any) => 
        data.type === 'error-rate' && 
        data.errorRate > 0.05, // 5%
      severity: 'critical',
      message: 'Error rate is above 5%. This indicates a serious system issue.',
      enabled: true,
      cooldown: 5,
    });
  }

  // Add default alert channels
  private addDefaultChannels() {
    // Email channel
    this.addChannel({
      id: 'email-admin',
      name: 'Admin Email Alerts',
      type: 'email',
      config: {
        recipients: process.env.ADMIN_EMAILS?.split(',') || ['admin@hotel.com'],
        subjectPrefix: '[HOTEL-PMS-ALERT]',
      },
      enabled: true,
    });

    // Slack channel
    this.addChannel({
      id: 'slack-alerts',
      name: 'Slack Alerts',
      type: 'slack',
      config: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL,
        channel: '#alerts',
        username: 'Hotel PMS Bot',
      },
      enabled: !!process.env.SLACK_WEBHOOK_URL,
    });

    // Webhook channel
    this.addChannel({
      id: 'webhook-alerts',
      name: 'Webhook Alerts',
      type: 'webhook',
      config: {
        url: process.env.ALERT_WEBHOOK_URL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ALERT_WEBHOOK_TOKEN}`,
        },
      },
      enabled: !!process.env.ALERT_WEBHOOK_URL,
    });
  }

  // Process health check results and trigger alerts
  async processHealthCheckResults(results: HealthCheckResult[]) {
    logger.debug('Processing health check results for alerts', { count: results.length });

    for (const result of results) {
      await this.evaluateRules(result);
    }
  }

  // Evaluate all rules against data
  private async evaluateRules(data: any) {
    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue;

      // Check cooldown
      if (rule.lastTriggered) {
        const cooldownMs = rule.cooldown * 60 * 1000;
        if (Date.now() - rule.lastTriggered.getTime() < cooldownMs) {
          continue;
        }
      }

      try {
        if (rule.condition(data)) {
          await this.triggerAlert(rule, data);
          rule.lastTriggered = new Date();
        }
      } catch (error) {
        logger.error('Error evaluating alert rule', { ruleId: rule.id, error });
      }
    }
  }

  // Trigger an alert
  private async triggerAlert(rule: AlertRule, data: any) {
    const alert: Alert = {
      id: `${rule.id}-${Date.now()}`,
      type: rule.severity,
      title: rule.name,
      message: rule.message,
      source: data.name || 'system',
      timestamp: new Date(),
      acknowledged: false,
      metadata: data,
    };

    this.alerts.set(alert.id, alert);
    logger.warn('Alert triggered', { alertId: alert.id, rule: rule.name, severity: rule.severity });

    // Send notifications through all enabled channels
    await this.sendNotifications(alert);
  }

  // Send notifications through all enabled channels
  private async sendNotifications(alert: Alert) {
    const enabledChannels = Array.from(this.channels.values()).filter(ch => ch.enabled);

    for (const channel of enabledChannels) {
      try {
        await this.sendNotification(channel, alert);
        logger.info('Alert notification sent', { channelId: channel.id, alertId: alert.id });
      } catch (error) {
        logger.error('Failed to send alert notification', { 
          channelId: channel.id, 
          alertId: alert.id, 
          error 
        });
      }
    }
  }

  // Send notification through a specific channel
  private async sendNotification(channel: AlertChannel, alert: Alert) {
    switch (channel.type) {
      case 'email':
        await this.sendEmailNotification(channel, alert);
        break;
      case 'slack':
        await this.sendSlackNotification(channel, alert);
        break;
      case 'webhook':
        await this.sendWebhookNotification(channel, alert);
        break;
      default:
        logger.warn('Unsupported channel type', { type: channel.type });
    }
  }

  // Send email notification
  private async sendEmailNotification(channel: AlertChannel, alert: Alert) {
    // This would integrate with your email service (SendGrid, etc.)
    logger.info('Email notification would be sent', {
      recipients: channel.config.recipients,
      subject: `${channel.config.subjectPrefix} ${alert.title}`,
      alertId: alert.id,
    });
  }

  // Send Slack notification
  private async sendSlackNotification(channel: AlertChannel, alert: Alert) {
    try {
      const response = await fetch(channel.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: channel.config.channel,
          username: channel.config.username,
          text: `🚨 *${alert.title}*\n${alert.message}\n\n*Source:* ${alert.source}\n*Severity:* ${alert.type}\n*Time:* ${alert.timestamp.toISOString()}`,
          color: this.getSeverityColor(alert.type),
        }),
      });

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Failed to send Slack notification: ${error}`);
    }
  }

  // Send webhook notification
  private async sendWebhookNotification(channel: AlertChannel, alert: Alert) {
    try {
      const response = await fetch(channel.config.url, {
        method: channel.config.method,
        headers: channel.config.headers,
        body: JSON.stringify({
          alert,
          timestamp: new Date().toISOString(),
          source: 'hotel-pms',
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Failed to send webhook notification: ${error}`);
    }
  }

  // Get severity color for Slack
  private getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return 'danger';
      case 'warning': return 'warning';
      case 'info': return 'good';
      default: return 'good';
    }
  }

  // Acknowledge an alert
  acknowledgeAlert(alertId: string, acknowledgedBy: string) {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = acknowledgedBy;
      alert.acknowledgedAt = new Date();
      logger.info('Alert acknowledged', { alertId, acknowledgedBy });
    }
  }

  // Get all alerts
  getAlerts(): Alert[] {
    return Array.from(this.alerts.values()).sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  // Get active alerts (not acknowledged)
  getActiveAlerts(): Alert[] {
    return this.getAlerts().filter(alert => !alert.acknowledged);
  }

  // Get alerts by severity
  getAlertsBySeverity(severity: string): Alert[] {
    return this.getAlerts().filter(alert => alert.type === severity);
  }

  // Clear old alerts
  clearOldAlerts(olderThanDays: number = 30) {
    const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
    const alertsToRemove = Array.from(this.alerts.values())
      .filter(alert => alert.timestamp < cutoffDate);

    for (const alert of alertsToRemove) {
      this.alerts.delete(alert.id);
    }

    logger.info('Cleared old alerts', { count: alertsToRemove.length, olderThanDays });
  }

  // Start alert manager
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    logger.info('Alert manager started');
    
    // Clear old alerts every day
    setInterval(() => {
      this.clearOldAlerts();
    }, 24 * 60 * 60 * 1000);
  }

  // Stop alert manager
  stop() {
    this.isRunning = false;
    logger.info('Alert manager stopped');
  }
}

// Export singleton instance
export const alertManager = new AlertManager();
export default alertManager;


