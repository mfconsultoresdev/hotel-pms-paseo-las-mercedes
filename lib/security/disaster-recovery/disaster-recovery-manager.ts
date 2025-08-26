import { createModuleLogger } from '@/lib/monitoring/logger';

const logger = createModuleLogger('disaster-recovery');

// ============================================================================
// GESTOR DE RECUPERACIÓN ANTE DESASTRES SIMPLIFICADO
// ============================================================================

// Tipos básicos de disaster recovery
export interface DisasterRecoveryPlan {
  id: string;
  name: string;
  description: string;
  scope: string;
  rto: number; // Recovery Time Objective (horas)
  rpo: number; // Recovery Point Objective (horas)
  criticalSystems: string[];
  recoveryProcedures: RecoveryProcedure[];
  contactList: ContactPerson[];
  lastTested: Date;
  nextTest: Date;
  status: 'draft' | 'approved' | 'active' | 'archived';
}

export interface RecoveryProcedure {
  id: string;
  planId: string;
  stepNumber: number;
  title: string;
  description: string;
  responsible: string;
  estimatedTime: number; // minutos
  dependencies: string[];
  successCriteria: string;
  rollbackPlan?: string;
}

export interface ContactPerson {
  id: string;
  planId: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  backupContact?: string;
  priority: number;
}

export interface BackupSchedule {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  retention: number; // días
  target: string;
  encryption: boolean;
  compression: boolean;
  lastBackup: Date;
  nextBackup: Date;
  status: 'active' | 'paused' | 'failed';
}

// Gestor de disaster recovery simplificado
export class DisasterRecoveryManager {
  private plans: Map<string, DisasterRecoveryPlan> = new Map();
  private backupSchedules: Map<string, BackupSchedule> = new Map();
  private recoveryHistory: Array<{
    id: string;
    planId: string;
    trigger: string;
    startTime: Date;
    endTime?: Date;
    status: 'in_progress' | 'completed' | 'failed';
    notes: string[];
  }> = [];

  constructor() {
    logger.info('Disaster recovery manager initialized');
    this.initializeDefaultPlans();
  }

  // Inicializar planes por defecto
  private initializeDefaultPlans(): void {
    const defaultPlan: DisasterRecoveryPlan = {
      id: 'default-dr-plan',
      name: 'Default Disaster Recovery Plan',
      description: 'Basic disaster recovery plan for critical systems',
      scope: 'Critical hotel systems',
      rto: 4, // 4 horas
      rpo: 1, // 1 hora
      criticalSystems: [
        'Reservation System',
        'Payment Processing',
        'Guest Database',
        'Communication Systems',
      ],
      recoveryProcedures: [
        {
          id: 'proc-001',
          planId: 'default-dr-plan',
          stepNumber: 1,
          title: 'Assess Damage',
          description: 'Evaluate the extent of system damage and identify affected components',
          responsible: 'IT Manager',
          estimatedTime: 30,
          dependencies: [],
          successCriteria: 'Damage assessment completed and documented',
        },
        {
          id: 'proc-002',
          planId: 'default-dr-plan',
          stepNumber: 2,
          title: 'Activate Backup Systems',
          description: 'Start backup systems and verify connectivity',
          responsible: 'System Administrator',
          estimatedTime: 60,
          dependencies: ['proc-001'],
          successCriteria: 'Backup systems operational and accessible',
        },
        {
          id: 'proc-003',
          planId: 'default-dr-plan',
          stepNumber: 3,
          title: 'Restore Critical Data',
          description: 'Restore critical data from latest backup',
          responsible: 'Database Administrator',
          estimatedTime: 120,
          dependencies: ['proc-002'],
          successCriteria: 'Critical data restored and verified',
        },
      ],
      contactList: [
        {
          id: 'contact-001',
          planId: 'default-dr-plan',
          name: 'IT Manager',
          role: 'Primary Contact',
          email: 'it.manager@hotel.com',
          phone: '+1-555-0123',
          priority: 1,
        },
        {
          id: 'contact-002',
          planId: 'default-dr-plan',
          name: 'Hotel Manager',
          role: 'Secondary Contact',
          email: 'manager@hotel.com',
          phone: '+1-555-0124',
          priority: 2,
        },
      ],
      lastTested: new Date(),
      nextTest: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 días
      status: 'active',
    };

    this.plans.set(defaultPlan.id, defaultPlan);

    // Configurar horario de backup por defecto
    const defaultBackup: BackupSchedule = {
      id: 'default-backup',
      name: 'Daily Full Backup',
      type: 'full',
      frequency: 'daily',
      retention: 30,
      target: '/backup/storage',
      encryption: true,
      compression: true,
      lastBackup: new Date(),
      nextBackup: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      status: 'active',
    };

    this.backupSchedules.set(defaultBackup.id, defaultBackup);

    logger.info('Default disaster recovery plans and backup schedules initialized');
  }

  // Gestión de planes de recuperación
  addRecoveryPlan(plan: DisasterRecoveryPlan): boolean {
    try {
      this.plans.set(plan.id, plan);
      logger.info(`Disaster recovery plan ${plan.name} added`);
      return true;
    } catch (error) {
      logger.error('Error adding recovery plan', { error: error instanceof Error ? error.message : String(error) });
      return false;
    }
  }

  getRecoveryPlan(planId: string): DisasterRecoveryPlan | undefined {
    return this.plans.get(planId);
  }

  getAllPlans(): DisasterRecoveryPlan[] {
    return Array.from(this.plans.values());
  }

  updatePlanStatus(planId: string, status: DisasterRecoveryPlan['status']): boolean {
    try {
      const plan = this.plans.get(planId);
      if (plan) {
        plan.status = status;
        this.plans.set(planId, plan);
        
        logger.info(`Plan ${plan.name} status updated to ${status}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error updating plan status', { error: error instanceof Error ? error.message : String(error) });
      return false;
    }
  }

  // Gestión de horarios de backup
  addBackupSchedule(schedule: BackupSchedule): boolean {
    try {
      this.backupSchedules.set(schedule.id, schedule);
      logger.info(`Backup schedule ${schedule.name} added`);
      return true;
    } catch (error) {
      logger.error('Error adding backup schedule', { error: error instanceof Error ? error.message : String(error) });
      return false;
    }
  }

  getBackupSchedule(scheduleId: string): BackupSchedule | undefined {
    return this.backupSchedules.get(scheduleId);
  }

  getAllBackupSchedules(): BackupSchedule[] {
    return Array.from(this.backupSchedules.values());
  }

  updateBackupStatus(scheduleId: string, status: BackupSchedule['status']): boolean {
    try {
      const schedule = this.backupSchedules.get(scheduleId);
      if (schedule) {
        schedule.status = status;
        if (status === 'active') {
          schedule.lastBackup = new Date();
          schedule.nextBackup = new Date(Date.now() + this.getBackupInterval(schedule.frequency));
        }
        this.backupSchedules.set(scheduleId, schedule);
        
        logger.info(`Backup schedule ${schedule.name} status updated to ${status}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error updating backup status', { error: error instanceof Error ? error.message : String(error) });
      return false;
    }
  }

  // Calcular intervalo de backup
  private getBackupInterval(frequency: BackupSchedule['frequency']): number {
    switch (frequency) {
      case 'hourly':
        return 60 * 60 * 1000; // 1 hora
      case 'daily':
        return 24 * 60 * 60 * 1000; // 24 horas
      case 'weekly':
        return 7 * 24 * 60 * 60 * 1000; // 7 días
      case 'monthly':
        return 30 * 24 * 60 * 60 * 1000; // 30 días
      default:
        return 24 * 60 * 60 * 1000; // 24 horas por defecto
    }
  }

  // Iniciar proceso de recuperación
  startRecovery(planId: string, trigger: string): string | null {
    try {
      const plan = this.plans.get(planId);
      if (!plan || plan.status !== 'active') {
        logger.error('Cannot start recovery: plan not found or inactive', { planId, status: plan?.status });
        return null;
      }

      const recoveryId = `recovery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const recovery = {
        id: recoveryId,
        planId,
        trigger,
        startTime: new Date(),
        status: 'in_progress' as const,
        notes: [`Recovery initiated due to: ${trigger}`],
      };

      this.recoveryHistory.push(recovery);
      
      logger.info(`Disaster recovery initiated for plan ${plan.name}`, {
        recoveryId,
        trigger,
        rto: plan.rto,
        rpo: plan.rpo,
      });

      return recoveryId;

    } catch (error) {
      logger.error('Error starting recovery', { error: error instanceof Error ? error.message : String(error) });
      return null;
    }
  }

  // Completar paso de recuperación
  completeRecoveryStep(recoveryId: string, stepNumber: number, notes: string): boolean {
    try {
      const recovery = this.recoveryHistory.find(r => r.id === recoveryId);
      if (!recovery || recovery.status !== 'in_progress') {
        logger.error('Cannot complete step: recovery not found or not in progress', { recoveryId });
        return false;
      }

      recovery.notes.push(`Step ${stepNumber} completed: ${notes}`);
      
      logger.info(`Recovery step ${stepNumber} completed`, { recoveryId, notes });
      return true;

    } catch (error) {
      logger.error('Error completing recovery step', { error: error instanceof Error ? error.message : String(error) });
      return false;
    }
  }

  // Finalizar proceso de recuperación
  completeRecovery(recoveryId: string, success: boolean, finalNotes: string): boolean {
    try {
      const recovery = this.recoveryHistory.find(r => r.id === recoveryId);
      if (!recovery || recovery.status !== 'in_progress') {
        logger.error('Cannot complete recovery: not found or not in progress', { recoveryId });
        return false;
      }

      recovery.endTime = new Date();
      recovery.status = success ? 'completed' : 'failed';
      recovery.notes.push(`Recovery ${success ? 'completed successfully' : 'failed'}: ${finalNotes}`);

      const duration = recovery.endTime.getTime() - recovery.startTime.getTime();
      const durationHours = duration / (1000 * 60 * 60);

      logger.info(`Disaster recovery ${success ? 'completed' : 'failed'}`, {
        recoveryId,
        duration: `${durationHours.toFixed(2)} hours`,
        notes: finalNotes,
      });

      return true;

    } catch (error) {
      logger.error('Error completing recovery', { error: error instanceof Error ? error.message : String(error) });
      return false;
    }
  }

  // Verificar estado de backup
  checkBackupStatus(): Array<{
    schedule: BackupSchedule;
    status: 'on_time' | 'overdue' | 'failed';
    nextBackup: Date;
  }> {
    try {
      const now = new Date();
      const results: Array<{
        schedule: BackupSchedule;
        status: 'on_time' | 'overdue' | 'failed';
        nextBackup: Date;
      }> = [];

      this.backupSchedules.forEach(schedule => {
        if (schedule.status === 'active') {
          let status: 'on_time' | 'overdue' | 'failed';
          
          if (now > schedule.nextBackup) {
            status = 'overdue';
          } else {
            status = 'on_time';
          }

          results.push({
            schedule,
            status,
            nextBackup: schedule.nextBackup,
          });
        } else if (schedule.status === 'failed') {
          results.push({
            schedule,
            status: 'failed',
            nextBackup: schedule.nextBackup,
          });
        }
      });

      return results;

    } catch (error) {
      logger.error('Error checking backup status', { error: error instanceof Error ? error.message : String(error) });
      return [];
    }
  }

  // Generar reporte de disaster recovery
  generateDRReport(): string {
    try {
      const plans = this.getAllPlans();
      const backupSchedules = this.getAllBackupSchedules();
      const activeRecoveries = this.recoveryHistory.filter(r => r.status === 'in_progress');
      const recentRecoveries = this.recoveryHistory
        .filter(r => r.startTime > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // Últimos 30 días
        .slice(0, 10); // Solo los últimos 10

      const report = `
DISASTER RECOVERY REPORT
Generated: ${new Date().toISOString()}

OVERVIEW:
- Total Recovery Plans: ${plans.length}
- Active Plans: ${plans.filter(p => p.status === 'active').length}
- Total Backup Schedules: ${backupSchedules.length}
- Active Backups: ${backupSchedules.filter(b => b.status === 'active').length}
- Active Recoveries: ${activeRecoveries.length}

RECOVERY PLANS:
${plans.map(plan => `- ${plan.name} (${plan.status}): RTO ${plan.rto}h, RPO ${plan.rpo}h`).join('\n')}

BACKUP STATUS:
${this.checkBackupStatus().map(result => 
  `- ${result.schedule.name}: ${result.status} (Next: ${result.nextBackup.toISOString().split('T')[0]})`
).join('\n')}

RECENT RECOVERIES:
${recentRecoveries.map(recovery => 
  `- ${recovery.id}: ${recovery.trigger} - ${recovery.status} (${recovery.startTime.toISOString().split('T')[0]})`
).join('\n')}

RECOMMENDATIONS:
${this.generateRecommendations(plans, backupSchedules)}
      `.trim();

      logger.info('Disaster recovery report generated');
      return report;

    } catch (error) {
      logger.error('Error generating DR report', { error: error instanceof Error ? error.message : String(error) });
      return 'Error generating report';
    }
  }

  // Generar recomendaciones
  private generateRecommendations(
    plans: DisasterRecoveryPlan[],
    backupSchedules: BackupSchedule[]
  ): string {
    const recommendations: string[] = [];

    // Verificar planes que necesitan testing
    const plansNeedingTest = plans.filter(plan => 
      plan.status === 'active' && plan.nextTest < new Date()
    );
    if (plansNeedingTest.length > 0) {
      recommendations.push(`Test ${plansNeedingTest.length} recovery plan(s) that are overdue for testing`);
    }

    // Verificar backups fallidos
    const failedBackups = backupSchedules.filter(schedule => schedule.status === 'failed');
    if (failedBackups.length > 0) {
      recommendations.push(`Investigate ${failedBackups.length} failed backup schedule(s)`);
    }

    // Verificar backups atrasados
    const overdueBackups = this.checkBackupStatus().filter(result => result.status === 'overdue');
    if (overdueBackups.length > 0) {
      recommendations.push(`Address ${overdueBackups.length} overdue backup(s)`);
    }

    if (recommendations.length === 0) {
      recommendations.push('All systems are operating normally');
    }

    return recommendations.join('\n');
  }

  // Limpiar historial antiguo
  cleanupOldHistory(daysToKeep: number = 365): number {
    try {
      const cutoff = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
      const initialCount = this.recoveryHistory.length;
      
      this.recoveryHistory = this.recoveryHistory.filter(recovery => 
        recovery.startTime > cutoff
      );
      
      const cleaned = initialCount - this.recoveryHistory.length;
      
      if (cleaned > 0) {
        logger.info(`Cleaned up ${cleaned} old recovery history records`);
      }
      
      return cleaned;
    } catch (error) {
      logger.error('Error cleaning up old history', { error: error instanceof Error ? error.message : String(error) });
      return 0;
    }
  }

  // Obtener estadísticas
  getStats(): {
    totalPlans: number;
    activePlans: number;
    totalBackupSchedules: number;
    activeBackups: number;
    totalRecoveries: number;
    successfulRecoveries: number;
    averageRecoveryTime: number; // horas
  } {
    try {
      const totalPlans = this.plans.size;
      const activePlans = Array.from(this.plans.values()).filter(p => p.status === 'active').length;
      const totalBackupSchedules = this.backupSchedules.size;
      const activeBackups = Array.from(this.backupSchedules.values()).filter(b => b.status === 'active').length;
      const totalRecoveries = this.recoveryHistory.length;
      const successfulRecoveries = this.recoveryHistory.filter(r => r.status === 'completed').length;

      const completedRecoveries = this.recoveryHistory.filter(r => r.status === 'completed' && r.endTime);
      const averageRecoveryTime = completedRecoveries.length > 0
        ? completedRecoveries.reduce((sum, r) => {
            const duration = r.endTime!.getTime() - r.startTime.getTime();
            return sum + (duration / (1000 * 60 * 60)); // Convertir a horas
          }, 0) / completedRecoveries.length
        : 0;

      return {
        totalPlans,
        activePlans,
        totalBackupSchedules,
        activeBackups,
        totalRecoveries,
        successfulRecoveries,
        averageRecoveryTime: Math.round(averageRecoveryTime * 100) / 100,
      };
    } catch (error) {
      logger.error('Error getting DR stats', { error: error instanceof Error ? error.message : String(error) });
      return {
        totalPlans: 0,
        activePlans: 0,
        totalBackupSchedules: 0,
        activeBackups: 0,
        totalRecoveries: 0,
        successfulRecoveries: 0,
        averageRecoveryTime: 0,
      };
    }
  }
}

// Instancia global del gestor de disaster recovery
export const disasterRecoveryManager = new DisasterRecoveryManager();
export default disasterRecoveryManager;
