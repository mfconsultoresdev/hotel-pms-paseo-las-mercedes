import { createModuleLogger } from './logger';

const logger = createModuleLogger('health-checker');

export interface HealthCheckResult {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  lastCheck: Date;
  details?: any;
  error?: string;
}

export interface HealthCheck {
  name: string;
  check: () => Promise<HealthCheckResult>;
  critical: boolean;
  timeout: number;
}

export class HealthChecker {
  private checks: HealthCheck[] = [];
  private results: Map<string, HealthCheckResult> = new Map();
  private isRunning = false;

  constructor() {
    this.addDefaultChecks();
  }

  // Add a new health check
  addCheck(check: HealthCheck) {
    this.checks.push(check);
    logger.info(`Added health check: ${check.name}`);
  }

  // Add default system health checks
  private addDefaultChecks() {
    // Database health check
    this.addCheck({
      name: 'database',
      critical: true,
      timeout: 5000,
      check: async () => {
        const startTime = Date.now();
        try {
          // This would be replaced with actual database check
          await new Promise(resolve => setTimeout(resolve, 100));
          const responseTime = Date.now() - startTime;
          
          return {
            name: 'database',
            status: 'healthy',
            responseTime,
            lastCheck: new Date(),
            details: {
              connection: 'active',
              version: 'PostgreSQL 15',
            },
          };
        } catch (error) {
          return {
            name: 'database',
            status: 'unhealthy',
            responseTime: Date.now() - startTime,
            lastCheck: new Date(),
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      },
    });

    // Redis health check
    this.addCheck({
      name: 'redis',
      critical: false,
      timeout: 3000,
      check: async () => {
        const startTime = Date.now();
        try {
          // This would be replaced with actual Redis check
          await new Promise(resolve => setTimeout(resolve, 50));
          const responseTime = Date.now() - startTime;
          
          return {
            name: 'redis',
            status: 'healthy',
            responseTime,
            lastCheck: new Date(),
            details: {
              connection: 'active',
              memory: '64MB used',
            },
          };
        } catch (error) {
          return {
            name: 'redis',
            status: 'unhealthy',
            responseTime: Date.now() - startTime,
            lastCheck: new Date(),
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      },
    });

    // External API health check
    this.addCheck({
      name: 'external-apis',
      critical: false,
      timeout: 10000,
      check: async () => {
        const startTime = Date.now();
        try {
          // Check payment gateways
          const paymentGateways = await this.checkPaymentGateways();
          
          // Check OTA integrations
          const otaIntegrations = await this.checkOTAIntegrations();
          
          const responseTime = Date.now() - startTime;
          const overallStatus = this.determineOverallStatus([paymentGateways, otaIntegrations]);
          
          return {
            name: 'external-apis',
            status: overallStatus,
            responseTime,
            lastCheck: new Date(),
            details: {
              paymentGateways,
              otaIntegrations,
            },
          };
        } catch (error) {
          return {
            name: 'external-apis',
            status: 'unhealthy',
            responseTime: Date.now() - startTime,
            lastCheck: new Date(),
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      },
    });

    // File system health check
    this.addCheck({
      name: 'file-system',
      critical: false,
      timeout: 2000,
      check: async () => {
        const startTime = Date.now();
        try {
          // This would check disk space, file permissions, etc.
          await new Promise(resolve => setTimeout(resolve, 50));
          const responseTime = Date.now() - startTime;
          
          return {
            name: 'file-system',
            status: 'healthy',
            responseTime,
            lastCheck: new Date(),
            details: {
              diskSpace: '85% available',
              permissions: 'correct',
            },
          };
        } catch (error) {
          return {
            name: 'file-system',
            status: 'unhealthy',
            responseTime: Date.now() - startTime,
            lastCheck: new Date(),
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      },
    });

    // Memory and CPU health check
    this.addCheck({
      name: 'system-resources',
      critical: false,
      timeout: 1000,
      check: async () => {
        const startTime = Date.now();
        try {
          const memUsage = process.memoryUsage();
          const responseTime = Date.now() - startTime;
          
          const memoryUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
          const status = memoryUsagePercent > 90 ? 'degraded' : 'healthy';
          
          return {
            name: 'system-resources',
            status,
            responseTime,
            lastCheck: new Date(),
            details: {
              memoryUsage: `${Math.round(memoryUsagePercent)}%`,
              heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
              heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
            },
          };
        } catch (error) {
          return {
            name: 'system-resources',
            status: 'unhealthy',
            responseTime: Date.now() - startTime,
            lastCheck: new Date(),
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      },
    });
  }

  // Check payment gateways health
  private async checkPaymentGateways() {
    const gateways = ['stripe', 'paypal', 'mercadopago'];
    const results = [];

    for (const gateway of gateways) {
      try {
        // This would be replaced with actual gateway health checks
        await new Promise(resolve => setTimeout(resolve, 100));
        results.push({
          name: gateway,
          status: 'healthy',
          responseTime: 100,
        });
      } catch (error) {
        results.push({
          name: gateway,
          status: 'unhealthy',
          responseTime: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  // Check OTA integrations health
  private async checkOTAIntegrations() {
    const otas = ['booking.com', 'expedia', 'airbnb'];
    const results = [];

    for (const ota of otas) {
      try {
        // This would be replaced with actual OTA health checks
        await new Promise(resolve => setTimeout(resolve, 200));
        results.push({
          name: ota,
          status: 'healthy',
          responseTime: 200,
        });
      } catch (error) {
        results.push({
          name: ota,
          status: 'unhealthy',
          responseTime: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  // Determine overall status from multiple checks
  private determineOverallStatus(checkResults: any[]): 'healthy' | 'unhealthy' | 'degraded' {
    const hasUnhealthy = checkResults.some(result => 
      Array.isArray(result) 
        ? result.some(r => r.status === 'unhealthy')
        : result.status === 'unhealthy'
    );
    
    const hasDegraded = checkResults.some(result => 
      Array.isArray(result) 
        ? result.some(r => r.status === 'degraded')
        : result.status === 'degraded'
    );

    if (hasUnhealthy) return 'unhealthy';
    if (hasDegraded) return 'degraded';
    return 'healthy';
  }

  // Run all health checks
  async runAllChecks(): Promise<HealthCheckResult[]> {
    if (this.isRunning) {
      logger.warn('Health checks already running');
      return Array.from(this.results.values());
    }

    this.isRunning = true;
    logger.info('Starting health checks');

    try {
      const checkPromises = this.checks.map(async (check) => {
        try {
          const result = await Promise.race([
            check.check(),
            new Promise<HealthCheckResult>((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), check.timeout)
            ),
          ]);
          
          this.results.set(check.name, result);
          return result;
        } catch (error) {
          const result: HealthCheckResult = {
            name: check.name,
            status: 'unhealthy',
            responseTime: 0,
            lastCheck: new Date(),
            error: error instanceof Error ? error.message : 'Unknown error',
          };
          
          this.results.set(check.name, result);
          return result;
        }
      });

      const results = await Promise.all(checkPromises);
      logger.info('Health checks completed', { results: results.length });
      
      return results;
    } finally {
      this.isRunning = false;
    }
  }

  // Get overall system health
  getOverallHealth(): 'healthy' | 'unhealthy' | 'degraded' {
    const results = Array.from(this.results.values());
    
    if (results.length === 0) return 'degraded';
    
    const criticalChecks = results.filter(result => {
      const check = this.checks.find(c => c.name === result.name);
      return check?.critical;
    });

    const hasCriticalUnhealthy = criticalChecks.some(r => r.status === 'unhealthy');
    const hasAnyUnhealthy = results.some(r => r.status === 'unhealthy');
    const hasDegraded = results.some(r => r.status === 'degraded');

    if (hasCriticalUnhealthy) return 'unhealthy';
    if (hasAnyUnhealthy || hasDegraded) return 'degraded';
    return 'healthy';
  }

  // Get health check results
  getResults(): Map<string, HealthCheckResult> {
    return new Map(this.results);
  }

  // Get specific check result
  getResult(name: string): HealthCheckResult | undefined {
    return this.results.get(name);
  }

  // Start periodic health checks
  startPeriodicChecks(intervalMs: number = 30000) {
    logger.info(`Starting periodic health checks every ${intervalMs}ms`);
    
    setInterval(async () => {
      await this.runAllChecks();
    }, intervalMs);
  }

  // Stop periodic health checks
  stopPeriodicChecks() {
    logger.info('Stopping periodic health checks');
    // Note: In a real implementation, you'd need to store the interval ID
  }
}

// Export singleton instance
export const healthChecker = new HealthChecker();
export default healthChecker;

