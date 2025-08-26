import { createModuleLogger } from '@/lib/monitoring/logger';

const logger = createModuleLogger('audit');

// Tipos de eventos de seguridad
export type SecurityEventType = 
  | 'login_success'
  | 'login_failure'
  | 'logout'
  | 'password_change'
  | 'mfa_enabled'
  | 'mfa_disabled'
  | 'permission_change'
  | 'data_access'
  | 'data_modification'
  | 'security_alert'
  | 'system_error';

export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

// Interfaz para eventos de seguridad
export interface SecurityEvent {
  id: string;
  eventType: SecurityEventType;
  severity: SecuritySeverity;
  description: string;
  details?: Record<string, any>;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  resolved: boolean;
}

// Gestor de auditoría simplificado
export class SecurityAuditLogger {
  private events: SecurityEvent[] = [];
  private maxEvents: number = 10000; // Mantener solo los últimos 10k eventos

  constructor() {
    logger.info('Security audit logger initialized');
  }

  // Registrar evento de seguridad
  async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<string> {
    const securityEvent: SecurityEvent = {
      ...event,
      id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    this.events.push(securityEvent);
    
    // Limpiar eventos antiguos si excedemos el límite
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log del evento
    const logLevel = this.getLogLevel(securityEvent.severity);
    logger[logLevel](`Security Event: ${securityEvent.eventType} - ${securityEvent.description}`, {
      eventId: securityEvent.id,
      severity: securityEvent.severity,
      userId: securityEvent.userId,
      ipAddress: securityEvent.ipAddress,
      details: securityEvent.details,
    });

    return securityEvent.id;
  }

  // Obtener nivel de log basado en severidad
  private getLogLevel(severity: SecuritySeverity): 'info' | 'warn' | 'error' {
    switch (severity) {
      case 'low':
      case 'medium':
        return 'info';
      case 'high':
        return 'warn';
      case 'critical':
        return 'error';
      default:
        return 'info';
    }
  }

  // Buscar eventos por criterios
  searchEvents(criteria: {
    eventType?: SecurityEventType;
    severity?: SecuritySeverity;
    userId?: string;
    ipAddress?: string;
    startDate?: Date;
    endDate?: Date;
    resolved?: boolean;
  }): SecurityEvent[] {
    return this.events.filter(event => {
      if (criteria.eventType && event.eventType !== criteria.eventType) return false;
      if (criteria.severity && event.severity !== criteria.severity) return false;
      if (criteria.userId && event.userId !== criteria.userId) return false;
      if (criteria.ipAddress && event.ipAddress !== criteria.ipAddress) return false;
      if (criteria.startDate && event.timestamp < criteria.startDate) return false;
      if (criteria.endDate && event.timestamp > criteria.endDate) return false;
      if (criteria.resolved !== undefined && event.resolved !== criteria.resolved) return false;
      return true;
    });
  }

  // Marcar evento como resuelto
  async resolveEvent(eventId: string): Promise<boolean> {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.resolved = true;
      logger.info(`Security event ${eventId} marked as resolved`);
      return true;
    }
    return false;
  }

  // Obtener estadísticas de eventos
  getEventStats(): {
    totalEvents: number;
    eventsByType: Record<SecurityEventType, number>;
    eventsBySeverity: Record<SecuritySeverity, number>;
    unresolvedEvents: number;
    recentEvents: number;
  } {
    const totalEvents = this.events.length;
    const unresolvedEvents = this.events.filter(e => !e.resolved).length;
    
    const recentEvents = this.events.filter(e => 
      e.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24 horas
    ).length;

    const eventsByType: Record<SecurityEventType, number> = {
      login_success: 0,
      login_failure: 0,
      logout: 0,
      password_change: 0,
      mfa_enabled: 0,
      mfa_disabled: 0,
      permission_change: 0,
      data_access: 0,
      data_modification: 0,
      security_alert: 0,
      system_error: 0,
    };

    const eventsBySeverity: Record<SecuritySeverity, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    this.events.forEach(event => {
      eventsByType[event.eventType]++;
      eventsBySeverity[event.severity]++;
    });

    return {
      totalEvents,
      eventsByType,
      eventsBySeverity,
      unresolvedEvents,
      recentEvents,
    };
  }

  // Limpiar eventos antiguos
  cleanupOldEvents(daysToKeep: number = 90): number {
    const cutoff = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    const initialCount = this.events.length;
    
    this.events = this.events.filter(event => event.timestamp > cutoff);
    
    const cleaned = initialCount - this.events.length;
    
    if (cleaned > 0) {
      logger.info(`Cleaned up ${cleaned} old security events`);
    }
    
    return cleaned;
  }

  // Exportar eventos para análisis
  exportEvents(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['id', 'eventType', 'severity', 'description', 'userId', 'ipAddress', 'timestamp', 'resolved'];
      const csvRows = [headers.join(',')];
      
      this.events.forEach(event => {
        const row = [
          event.id,
          event.eventType,
          event.severity,
          `"${event.description.replace(/"/g, '""')}"`,
          event.userId || '',
          event.ipAddress || '',
          event.timestamp.toISOString(),
          event.resolved.toString(),
        ];
        csvRows.push(row.join(','));
      });
      
      return csvRows.join('\n');
    } else {
      return JSON.stringify(this.events, null, 2);
    }
  }
}

// Instancia global del logger de auditoría
export const securityAuditLogger = new SecurityAuditLogger();

// Función de conveniencia para logging rápido
export async function logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<string> {
  return securityAuditLogger.logSecurityEvent(event);
}

export default securityAuditLogger;
