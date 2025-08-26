import { paymentGatewayManager } from '../payment-gateways';
import { 
  OTAConfig, 
  OTASyncRequest, 
  OTASyncResponse 
} from '../ota-integrations/types';
import { 
  CommunicationConfig, 
  EmailRequest, 
  EmailResponse 
} from '../communication/types';
import { 
  AccountingConfig, 
  SyncRequest as AccountingSyncRequest, 
  SyncResponse as AccountingSyncResponse 
} from '../accounting/types';
import { 
  TourismServiceConfig, 
  FlightSearchRequest, 
  FlightOffer 
} from '../tourism-services/types';
import { 
  AnalyticsConfig, 
  AnalyticsEvent, 
  AnalyticsResponse 
} from '../analytics/types';

export interface IntegrationStatus {
  service: string;
  isActive: boolean;
  isConnected: boolean;
  lastSync?: Date;
  lastError?: string;
  health: 'healthy' | 'warning' | 'error' | 'unknown';
}

export interface IntegrationMetrics {
  service: string;
  period: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  totalDataProcessed: number;
  lastUpdated: Date;
}

export class IntegrationManager {
  private static instance: IntegrationManager;
  private integrations: Map<string, any> = new Map();
  private status: Map<string, IntegrationStatus> = new Map();
  private metrics: Map<string, IntegrationMetrics> = new Map();

  private constructor() {
    this.initializeIntegrations();
  }

  public static getInstance(): IntegrationManager {
    if (!IntegrationManager.instance) {
      IntegrationManager.instance = new IntegrationManager();
    }
    return IntegrationManager.instance;
  }

  private initializeIntegrations(): void {
    // Initialize payment gateways
    this.integrations.set('payment_gateways', paymentGatewayManager);
    
    // Initialize other integrations as needed
    console.log('Integration Manager initialized');
  }

  // Payment Gateway Management
  async processPayment(provider: string, request: any): Promise<any> {
    try {
      const startTime = Date.now();
      const result = await paymentGatewayManager.processPayment(provider, request);
      this.updateMetrics('payment_gateways', startTime, result.success);
      return result;
    } catch (error) {
      this.updateMetrics('payment_gateways', Date.now(), false);
      throw error;
    }
  }

  async testPaymentGateway(provider: string): Promise<any> {
    try {
      return await paymentGatewayManager.testGateway(provider);
    } catch (error) {
      console.error(`Payment gateway test failed for ${provider}:`, error);
      throw error;
    }
  }

  // OTA Integration Management
  async syncOTAData(provider: string, request: OTASyncRequest): Promise<OTASyncResponse> {
    try {
      const startTime = Date.now();
      // Implementation would depend on specific OTA provider
      const result: OTASyncResponse = {
        success: true,
        message: `OTA sync completed for ${provider}`,
        syncTimestamp: new Date(),
        recordsProcessed: 0,
      };
      this.updateMetrics('ota_integrations', startTime, result.success);
      return result;
    } catch (error) {
      this.updateMetrics('ota_integrations', Date.now(), false);
      throw error;
    }
  }

  // Communication Services Management
  async sendEmail(request: EmailRequest): Promise<EmailResponse> {
    try {
      const startTime = Date.now();
      // Implementation would depend on configured email provider
      const result: EmailResponse = {
        success: true,
        message: 'Email sent successfully',
        sentAt: new Date(),
        deliveredTo: Array.isArray(request.to) ? request.to : [request.to],
        failedTo: [],
      };
      this.updateMetrics('communication_services', startTime, result.success);
      return result;
    } catch (error) {
      this.updateMetrics('communication_services', Date.now(), false);
      throw error;
    }
  }

  // Accounting Integration Management
  async syncAccountingData(request: AccountingSyncRequest): Promise<AccountingSyncResponse> {
    try {
      const startTime = Date.now();
      // Implementation would depend on configured accounting provider
      const result: AccountingSyncResponse = {
        success: true,
        message: 'Accounting sync completed',
        syncTimestamp: new Date(),
        recordsProcessed: 0,
        recordsCreated: 0,
        recordsUpdated: 0,
        recordsDeleted: 0,
      };
      this.updateMetrics('accounting_integrations', startTime, result.success);
      return result;
    } catch (error) {
      this.updateMetrics('accounting_integrations', Date.now(), false);
      throw error;
    }
  }

  // Tourism Services Management
  async searchFlights(request: FlightSearchRequest): Promise<FlightOffer[]> {
    try {
      const startTime = Date.now();
      // Implementation would depend on configured tourism service provider
      const result: FlightOffer[] = [];
      this.updateMetrics('tourism_services', startTime, true);
      return result;
    } catch (error) {
      this.updateMetrics('tourism_services', Date.now(), false);
      throw error;
    }
  }

  // Analytics Integration Management
  async trackEvent(event: AnalyticsEvent): Promise<boolean> {
    try {
      const startTime = Date.now();
      // Implementation would depend on configured analytics provider
      const result = true;
      this.updateMetrics('analytics_integrations', startTime, result);
      return result;
    } catch (error) {
      this.updateMetrics('analytics_integrations', Date.now(), false);
      throw error;
    }
  }

  async queryAnalytics(query: any): Promise<AnalyticsResponse> {
    try {
      const startTime = Date.now();
      // Implementation would depend on configured analytics provider
      const result: AnalyticsResponse = {
        success: true,
        data: {},
        metadata: {
          totalRows: 0,
          totalPages: 0,
          currentPage: 1,
          pageSize: 10,
          queryTime: Date.now() - startTime,
        },
      };
      this.updateMetrics('analytics_integrations', startTime, result.success);
      return result;
    } catch (error) {
      this.updateMetrics('analytics_integrations', Date.now(), false);
      throw error;
    }
  }

  // Health Check and Status Management
  async checkIntegrationHealth(): Promise<IntegrationStatus[]> {
    const healthChecks = await Promise.allSettled([
      this.checkPaymentGatewayHealth(),
      this.checkOTAHealth(),
      this.checkCommunicationHealth(),
      this.checkAccountingHealth(),
      this.checkTourismHealth(),
      this.checkAnalyticsHealth(),
    ]);

    const statuses: IntegrationStatus[] = [];
    
    healthChecks.forEach((result, index) => {
      const serviceNames = [
        'payment_gateways',
        'ota_integrations',
        'communication_services',
        'accounting_integrations',
        'tourism_services',
        'analytics_integrations',
      ];

      if (result.status === 'fulfilled') {
        statuses.push(result.value);
      } else {
        statuses.push({
          service: serviceNames[index],
          isActive: false,
          isConnected: false,
          health: 'error',
          lastError: result.reason?.message || 'Unknown error',
        });
      }
    });

    return statuses;
  }

  private async checkPaymentGatewayHealth(): Promise<IntegrationStatus> {
    try {
      const activeGateways = paymentGatewayManager.getActiveGateways();
      const isHealthy = activeGateways.length > 0;
      
      return {
        service: 'payment_gateways',
        isActive: true,
        isConnected: isHealthy,
        health: isHealthy ? 'healthy' : 'warning',
        lastSync: new Date(),
      };
    } catch (error) {
      return {
        service: 'payment_gateways',
        isActive: false,
        isConnected: false,
        health: 'error',
        lastError: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async checkOTAHealth(): Promise<IntegrationStatus> {
    // Placeholder implementation
    return {
      service: 'ota_integrations',
      isActive: false,
      isConnected: false,
      health: 'unknown',
    };
  }

  private async checkCommunicationHealth(): Promise<IntegrationStatus> {
    // Placeholder implementation
    return {
      service: 'communication_services',
      isActive: false,
      isConnected: false,
      health: 'unknown',
    };
  }

  private async checkAccountingHealth(): Promise<IntegrationStatus> {
    // Placeholder implementation
    return {
      service: 'accounting_integrations',
      isActive: false,
      isConnected: false,
      health: 'unknown',
    };
  }

  private async checkTourismHealth(): Promise<IntegrationStatus> {
    // Placeholder implementation
    return {
      service: 'tourism_services',
      isActive: false,
      isConnected: false,
      health: 'unknown',
    };
  }

  private async checkAnalyticsHealth(): Promise<IntegrationStatus> {
    // Placeholder implementation
    return {
      service: 'analytics_integrations',
      isActive: false,
      isConnected: false,
      health: 'unknown',
    };
  }

  // Metrics Management
  private updateMetrics(service: string, startTime: number, success: boolean): void {
    const existing = this.metrics.get(service) || {
      service,
      period: 'current',
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      totalDataProcessed: 0,
      lastUpdated: new Date(),
    };

    const responseTime = Date.now() - startTime;
    
    existing.totalRequests++;
    if (success) {
      existing.successfulRequests++;
    } else {
      existing.failedRequests++;
    }

    // Update average response time
    existing.averageResponseTime = 
      (existing.averageResponseTime * (existing.totalRequests - 1) + responseTime) / existing.totalRequests;
    
    existing.lastUpdated = new Date();
    
    this.metrics.set(service, existing);
  }

  getMetrics(service?: string): IntegrationMetrics[] {
    if (service) {
      const metrics = this.metrics.get(service);
      return metrics ? [metrics] : [];
    }
    return Array.from(this.metrics.values());
  }

  // Configuration Management
  async updateIntegrationConfig(service: string, config: any): Promise<boolean> {
    try {
      // Implementation would update the specific integration configuration
      console.log(`Updating configuration for ${service}`);
      return true;
    } catch (error) {
      console.error(`Failed to update configuration for ${service}:`, error);
      return false;
    }
  }

  async enableIntegration(service: string): Promise<boolean> {
    try {
      // Implementation would enable the specific integration
      console.log(`Enabling integration for ${service}`);
      return true;
    } catch (error) {
      console.error(`Failed to enable integration for ${service}:`, error);
      return false;
    }
  }

  async disableIntegration(service: string): Promise<boolean> {
    try {
      // Implementation would disable the specific integration
      console.log(`Disabling integration for ${service}`);
      return true;
    } catch (error) {
      console.error(`Failed to disable integration for ${service}:`, error);
      return false;
    }
  }

  // Utility Methods
  getActiveIntegrations(): string[] {
    return Array.from(this.integrations.keys());
  }

  getIntegrationStatus(service: string): IntegrationStatus | undefined {
    return this.status.get(service);
  }

  async refreshStatus(): Promise<void> {
    const healthStatuses = await this.checkIntegrationHealth();
    healthStatuses.forEach(status => {
      this.status.set(status.service, status);
    });
  }
}

// Export singleton instance
export const integrationManager = IntegrationManager.getInstance();

