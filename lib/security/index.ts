// ============================================================================
// EXPORTACIONES PRINCIPALES DEL MÓDULO DE SEGURIDAD
// ============================================================================

// Tipos básicos
export * from './types';

// Autenticación y Autorización
export * from './auth/mfa';

// Criptografía
export * from './crypto/password-crypto';
export * from './crypto/encryption';

// Middleware de seguridad
export * from './middleware/security';

// Validación
export * from './validation/validators';



// Cumplimiento
export * from './compliance/compliance-manager';

// Disaster Recovery
export * from './disaster-recovery/disaster-recovery-manager';

// ============================================================================
// EXPORTACIONES DE INSTANCIAS PRINCIPALES
// ============================================================================

// Exportar instancias principales
export { default as securityManager } from './auth/advanced-auth';
export { default as mfaManager } from './auth/mfa';
export { default as passwordCrypto } from './crypto/password-crypto';
export { default as encryptionManager } from './crypto/encryption';

export { default as securityMiddleware } from './middleware/security';
export { default as securityValidators } from './validation/validators';
export { default as securityAuditLogger } from './audit/logger';
export { default as complianceManager } from './compliance/compliance-manager';
export { default as disasterRecoveryManager } from './disaster-recovery/disaster-recovery-manager';

// ============================================================================
// CONFIGURACIÓN DE SEGURIDAD
// ============================================================================

export const SECURITY_CONFIG = {
  // Configuración de autenticación
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION || '30'), // minutos
  },

  // Configuración de MFA
  mfa: {
    enabled: process.env.MFA_ENABLED === 'true',
    methods: (process.env.MFA_METHODS || 'totp,sms,email').split(','),
    totpWindow: parseInt(process.env.TOTP_WINDOW || '1'),
  },

  // Configuración de contraseñas
  password: {
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8'),
    requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false',
    requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false',
    requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS !== 'false',
    requireSpecial: process.env.PASSWORD_REQUIRE_SPECIAL !== 'false',
  },

  // Configuración de encriptación
  encryption: {
    algorithm: process.env.ENCRYPTION_ALGORITHM || 'AES-256-GCM',
    keyRotationDays: parseInt(process.env.KEY_ROTATION_DAYS || '365'),
  },

  // Configuración de auditoría
  audit: {
    enabled: process.env.AUDIT_ENABLED !== 'false',
    retentionDays: parseInt(process.env.AUDIT_RETENTION_DAYS || '90'),
    logLevel: process.env.AUDIT_LOG_LEVEL || 'info',
  },

  // Configuración de cumplimiento
  compliance: {
    gdprEnabled: process.env.GDPR_ENABLED === 'true',
    pciEnabled: process.env.PCI_ENABLED === 'true',
    assessmentFrequency: parseInt(process.env.ASSESSMENT_FREQUENCY || '90'), // días
  },

  // Configuración de disaster recovery
  disasterRecovery: {
    enabled: process.env.DR_ENABLED === 'true',
    backupRetentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '2555'), // 7 años
    testFrequency: parseInt(process.env.DR_TEST_FREQUENCY || '90'), // días
  },
};

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

// Función para verificar si el módulo de seguridad está configurado correctamente
export function isSecurityModuleConfigured(): boolean {
  try {
    // Verificar variables de entorno críticas
    const requiredEnvVars = [
      'JWT_SECRET',
      'NODE_ENV',
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.warn('Missing required environment variables:', missingVars);
      return false;
    }

    // Verificar configuración básica
    if (SECURITY_CONFIG.auth.jwtSecret === 'default-secret-change-in-production') {
      console.warn('Using default JWT secret. Change in production!');
    }

    return true;
  } catch (error) {
    console.error('Error checking security module configuration:', error);
    return false;
  }
}

// Función para obtener el estado del módulo de seguridad
export function getSecurityModuleStatus(): {
  configured: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    // Verificar configuración
    if (!isSecurityModuleConfigured()) {
      errors.push('Security module not properly configured');
    }

    // Verificar secretos por defecto
    if (SECURITY_CONFIG.auth.jwtSecret === 'default-secret-change-in-production') {
      warnings.push('Using default JWT secret - change in production');
    }

    // Verificar entorno
    if (process.env.NODE_ENV === 'production') {
      if (SECURITY_CONFIG.auth.jwtSecret.length < 32) {
        warnings.push('JWT secret may be too short for production');
      }
    }

    return {
      configured: errors.length === 0,
      warnings,
      errors,
    };

  } catch (error) {
    return {
      configured: false,
      warnings: [],
      errors: ['Failed to check security module status'],
    };
  }
}

export default {
  SECURITY_CONFIG,
  isSecurityModuleConfigured,
  getSecurityModuleStatus,
};
