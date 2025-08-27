import { createModuleLogger } from '@/lib/monitoring/logger';
import { healthChecker } from '@/lib/monitoring/health-checker';

const logger = createModuleLogger('load-balancer');

export interface ServerNode {
  id: string;
  host: string;
  port: number;
  protocol: 'http' | 'https';
  weight: number;
  maxConnections: number;
  currentConnections: number;
  healthStatus: 'healthy' | 'unhealthy' | 'degraded';
  lastHealthCheck: Date;
  responseTime: number;
  isActive: boolean;
  metadata?: Record<string, any>;
}

export interface LoadBalancerConfig {
  algorithm: 'round-robin' | 'least-connections' | 'weighted' | 'ip-hash';
  healthCheckInterval: number;
  healthCheckTimeout: number;
  failoverThreshold: number;
  recoveryThreshold: number;
  stickySessions: boolean;
  sessionTimeout: number;
}

export interface LoadBalancerStats {
  totalRequests: number;
  activeConnections: number;
  healthyNodes: number;
  unhealthyNodes: number;
  degradedNodes: number;
  averageResponseTime: number;
  lastRequestTime: Date;
}

export class LoadBalancer {
  private nodes: Map<string, ServerNode> = new Map();
  private config: LoadBalancerConfig;
  private currentIndex: number = 0;
  private requestCount: number = 0;
  private sessionMap: Map<string, string> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor(config: LoadBalancerConfig) {
    this.config = config;
    this.startHealthChecks();
    logger.info('Load balancer initialized', { config });
  }

  // Add a server node
  addNode(node: Omit<ServerNode, 'healthStatus' | 'lastHealthCheck' | 'responseTime' | 'currentConnections'>): void {
    const newNode: ServerNode = {
      ...node,
      healthStatus: 'healthy',
      lastHealthCheck: new Date(),
      responseTime: 0,
      currentConnections: 0,
    };

    this.nodes.set(node.id, newNode);
    logger.info('Server node added', { nodeId: node.id, host: node.host, port: node.port });
  }

  // Remove a server node
  removeNode(nodeId: string): boolean {
    const removed = this.nodes.delete(nodeId);
    if (removed) {
      logger.info('Server node removed', { nodeId });
    }
    return removed;
  }

  // Get next available node based on algorithm
  getNextNode(clientIp?: string): ServerNode | null {
    const activeNodes = Array.from(this.nodes.values()).filter(node => node.isActive && node.healthStatus === 'healthy');
    
    if (activeNodes.length === 0) {
      logger.warn('No healthy nodes available');
      return null;
    }

    let selectedNode: ServerNode;

    switch (this.config.algorithm) {
      case 'round-robin':
        selectedNode = this.getRoundRobinNode(activeNodes);
        break;
      
      case 'least-connections':
        selectedNode = this.getLeastConnectionsNode(activeNodes);
        break;
      
      case 'weighted':
        selectedNode = this.getWeightedNode(activeNodes);
        break;
      
      case 'ip-hash':
        selectedNode = this.getIpHashNode(activeNodes, clientIp);
        break;
      
      default:
        selectedNode = activeNodes[0];
    }

    // Increment connection count
    selectedNode.currentConnections++;
    this.requestCount++;

    logger.debug('Node selected for request', {
      nodeId: selectedNode.id,
      algorithm: this.config.algorithm,
      currentConnections: selectedNode.currentConnections,
    });

    return selectedNode;
  }

  // Round-robin algorithm
  private getRoundRobinNode(nodes: ServerNode[]): ServerNode {
    const node = nodes[this.currentIndex % nodes.length];
    this.currentIndex = (this.currentIndex + 1) % nodes.length;
    return node;
  }

  // Least connections algorithm
  private getLeastConnectionsNode(nodes: ServerNode[]): ServerNode {
    return nodes.reduce((min, node) => 
      node.currentConnections < min.currentConnections ? node : min
    );
  }

  // Weighted algorithm
  private getWeightedNode(nodes: ServerNode[]): ServerNode {
    const totalWeight = nodes.reduce((sum, node) => sum + node.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const node of nodes) {
      random -= node.weight;
      if (random <= 0) {
        return node;
      }
    }
    
    return nodes[0];
  }

  // IP hash algorithm
  private getIpHashNode(nodes: ServerNode[], clientIp?: string): ServerNode {
    if (!clientIp) {
      return this.getRoundRobinNode(nodes);
    }
    
    const hash = this.hashIp(clientIp);
    const index = hash % nodes.length;
    return nodes[index];
  }

  // Simple IP hash function
  private hashIp(ip: string): number {
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
      const char = ip.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Get node for sticky session
  getNodeForSession(sessionId: string, clientIp?: string): ServerNode | null {
    if (this.config.stickySessions && this.sessionMap.has(sessionId)) {
      const nodeId = this.sessionMap.get(sessionId)!;
      const node = this.nodes.get(nodeId);
      
      if (node && node.isActive && node.healthStatus === 'healthy') {
        return node;
      } else {
        // Remove invalid session mapping
        this.sessionMap.delete(sessionId);
      }
    }

    // Get new node and create sticky session
    const node = this.getNextNode(clientIp);
    if (node && this.config.stickySessions) {
      this.sessionMap.set(sessionId, node.id);
      
      // Set session timeout
      setTimeout(() => {
        this.sessionMap.delete(sessionId);
      }, this.config.sessionTimeout);
    }

    return node;
  }

  // Release connection from node
  releaseConnection(nodeId: string): void {
    const node = this.nodes.get(nodeId);
    if (node && node.currentConnections > 0) {
      node.currentConnections--;
      logger.debug('Connection released from node', {
        nodeId,
        currentConnections: node.currentConnections,
      });
    }
  }

  // Start health checks
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthChecks();
    }, this.config.healthCheckInterval);

    logger.info('Health checks started', { interval: this.config.healthCheckInterval });
  }

  // Perform health checks on all nodes
  private async performHealthChecks(): Promise<void> {
    const healthCheckPromises = Array.from(this.nodes.values()).map(node => 
      this.checkNodeHealth(node)
    );

    await Promise.allSettled(healthCheckPromises);
    this.updateNodeStatuses();
  }

  // Check health of a specific node
  private async checkNodeHealth(node: ServerNode): Promise<void> {
    const startTime = Date.now();
    
    try {
      const healthUrl = `${node.protocol}://${node.host}:${node.port}/api/monitoring/health`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.healthCheckTimeout);

      const response = await fetch(healthUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Hotel-PMS-LoadBalancer/1.0',
        },
      });

      clearTimeout(timeoutId);
      
      const responseTime = Date.now() - startTime;
      const isHealthy = response.ok && response.status === 200;

      // Update node health status
      if (isHealthy) {
        node.healthStatus = 'healthy';
        node.responseTime = responseTime;
      } else {
        node.healthStatus = 'unhealthy';
      }

      node.lastHealthCheck = new Date();
      
      logger.debug('Node health check completed', {
        nodeId: node.id,
        status: node.healthStatus,
        responseTime,
        httpStatus: response.status,
      });

    } catch (error) {
      const responseTime = Date.now() - startTime;
      node.healthStatus = 'unhealthy';
      node.lastHealthCheck = new Date();
      node.responseTime = responseTime;

      logger.warn('Node health check failed', {
        nodeId: node.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime,
      });
    }
  }

  // Update node statuses based on health check results
  private updateNodeStatuses(): void {
    for (const node of this.nodes.values()) {
      const timeSinceLastCheck = Date.now() - node.lastHealthCheck.getTime();
      
      // Mark node as degraded if health check is stale
      if (timeSinceLastCheck > this.config.healthCheckInterval * 2) {
        node.healthStatus = 'degraded';
        logger.warn('Node marked as degraded due to stale health check', {
          nodeId: node.id,
          timeSinceLastCheck,
        });
      }

      // Deactivate node if it fails health checks repeatedly
      if (node.healthStatus === 'unhealthy') {
        const consecutiveFailures = this.getConsecutiveFailures(node.id);
        
        if (consecutiveFailures >= this.config.failoverThreshold) {
          node.isActive = false;
          logger.error('Node deactivated due to consecutive health check failures', {
            nodeId: node.id,
            consecutiveFailures,
            threshold: this.config.failoverThreshold,
          });
        }
      }

      // Reactivate node if it recovers
      if (!node.isActive && node.healthStatus === 'healthy') {
        const consecutiveSuccesses = this.getConsecutiveSuccesses(node.id);
        
        if (consecutiveSuccesses >= this.config.recoveryThreshold) {
          node.isActive = true;
          logger.info('Node reactivated after recovery', {
            nodeId: node.id,
            consecutiveSuccesses,
            threshold: this.config.recoveryThreshold,
          });
        }
      }
    }
  }

  // Get consecutive failures for a node
  private getConsecutiveFailures(nodeId: string): number {
    // This would be implemented with a more sophisticated tracking system
    // For now, return a simple count based on current status
    const node = this.nodes.get(nodeId);
    return node?.healthStatus === 'unhealthy' ? 1 : 0;
  }

  // Get consecutive successes for a node
  private getConsecutiveSuccesses(nodeId: string): number {
    // This would be implemented with a more sophisticated tracking system
    // For now, return a simple count based on current status
    const node = this.nodes.get(nodeId);
    return node?.healthStatus === 'healthy' ? 1 : 0;
  }

  // Get load balancer statistics
  getStats(): LoadBalancerStats {
    const nodes = Array.from(this.nodes.values());
    const healthyNodes = nodes.filter(n => n.healthStatus === 'healthy').length;
    const unhealthyNodes = nodes.filter(n => n.healthStatus === 'unhealthy').length;
    const degradedNodes = nodes.filter(n => n.healthStatus === 'degraded').length;
    
    const totalResponseTime = nodes.reduce((sum, node) => sum + node.responseTime, 0);
    const averageResponseTime = nodes.length > 0 ? totalResponseTime / nodes.length : 0;
    
    const totalConnections = nodes.reduce((sum, node) => sum + node.currentConnections, 0);

    return {
      totalRequests: this.requestCount,
      activeConnections: totalConnections,
      healthyNodes,
      unhealthyNodes,
      degradedNodes,
      averageResponseTime,
      lastRequestTime: new Date(),
    };
  }

  // Get all nodes
  getAllNodes(): ServerNode[] {
    return Array.from(this.nodes.values());
  }

  // Get healthy nodes
  getHealthyNodes(): ServerNode[] {
    return Array.from(this.nodes.values()).filter(node => 
      node.isActive && node.healthStatus === 'healthy'
    );
  }

  // Update node configuration
  updateNodeConfig(nodeId: string, updates: Partial<ServerNode>): boolean {
    const node = this.nodes.get(nodeId);
    if (!node) {
      return false;
    }

    Object.assign(node, updates);
    logger.info('Node configuration updated', { nodeId, updates });
    return true;
  }

  // Update load balancer configuration
  updateConfig(newConfig: Partial<LoadBalancerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart health checks if interval changed
    if (newConfig.healthCheckInterval && this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.startHealthChecks();
    }
    
    logger.info('Load balancer configuration updated', { newConfig });
  }

  // Stop health checks
  stopHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
      logger.info('Health checks stopped');
    }
  }

  // Clean up resources
  destroy(): void {
    this.stopHealthChecks();
    this.nodes.clear();
    this.sessionMap.clear();
    logger.info('Load balancer destroyed');
  }
}

// Export default configuration
export const defaultLoadBalancerConfig: LoadBalancerConfig = {
  algorithm: 'least-connections',
  healthCheckInterval: 30000, // 30 seconds
  healthCheckTimeout: 10000,  // 10 seconds
  failoverThreshold: 3,       // 3 consecutive failures
  recoveryThreshold: 2,       // 2 consecutive successes
  stickySessions: true,
  sessionTimeout: 300000,     // 5 minutes
};

// Export singleton instance
export const loadBalancer = new LoadBalancer(defaultLoadBalancerConfig);
export default loadBalancer;


