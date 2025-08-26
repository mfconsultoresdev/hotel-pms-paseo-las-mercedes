// ============================================================================
// TIPOS DE SEGURIDAD SIMPLIFICADOS
// ============================================================================

// Usuario del sistema
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Roles de usuario
export type UserRole = 
  | 'admin'
  | 'manager'
  | 'receptionist'
  | 'housekeeper'
  | 'maintenance'
  | 'guest';

// Permisos del sistema
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  isActive: boolean;
}

// Asignación de permisos a roles
export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  grantedAt: Date;
  grantedBy: string;
}

// Sesión de usuario
export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  createdAt: Date;
  lastActivity: Date;
}

// Intento de autenticación
export interface AuthAttempt {
  id: string;
  username: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  reason?: string;
  timestamp: Date;
}

// Configuración de seguridad
export interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number; // minutos
  passwordMinLength: number;
  passwordRequireSpecial: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireUppercase: boolean;
  sessionTimeout: number; // minutos
  mfaRequired: boolean;
  mfaMethods: string[];
}

// Configuración por defecto
export const defaultSecurityConfig: SecurityConfig = {
  maxLoginAttempts: 5,
  lockoutDuration: 30,
  passwordMinLength: 8,
  passwordRequireSpecial: true,
  passwordRequireNumbers: true,
  passwordRequireUppercase: true,
  sessionTimeout: 480, // 8 horas
  mfaRequired: false,
  mfaMethods: ['totp', 'sms', 'email'],
};

// Resultado de validación de contraseña
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  score: number; // 0-100
}

// Resultado de autenticación
export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  expiresAt?: Date;
  error?: string;
  requiresMFA?: boolean;
  mfaMethods?: string[];
}

// Resultado de verificación de permisos
export interface PermissionCheckResult {
  hasPermission: boolean;
  reason?: string;
  requiredPermission?: string;
  userRole?: string;
}

// Evento de auditoría
export interface AuditEvent {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  success: boolean;
}

// Configuración de MFA
export interface MFAConfig {
  enabled: boolean;
  methods: string[];
  backupCodes: string[];
  lastUsed?: Date;
}

// Token de acceso
export interface AccessToken {
  token: string;
  type: 'bearer';
  expiresIn: number;
  refreshToken: string;
  scope: string[];
}

// Refresh token
export interface RefreshToken {
  token: string;
  userId: string;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
}

// Configuración de rate limiting
export interface RateLimitConfig {
  windowMs: number; // milisegundos
  maxRequests: number;
  message: string;
  statusCode: number;
}

// Configuración por defecto de rate limiting
export const defaultRateLimitConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 100,
  message: 'Too many requests from this IP, please try again later.',
  statusCode: 429,
};

// Tipos de eventos de seguridad
export type SecurityEventType = 
  | 'user_login'
  | 'user_logout'
  | 'password_change'
  | 'permission_change'
  | 'role_change'
  | 'session_expired'
  | 'failed_login'
  | 'suspicious_activity'
  | 'data_access'
  | 'data_modification';

// Niveles de severidad
export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

// Evento de seguridad
export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  description: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  timestamp: Date;
  resolved: boolean;
}

// Configuración de logging de seguridad
export interface SecurityLogConfig {
  enabled: boolean;
  level: 'info' | 'warn' | 'error';
  includeSensitiveData: boolean;
  retentionDays: number;
  maxFileSize: string;
}

// Configuración por defecto de logging
export const defaultSecurityLogConfig: SecurityLogConfig = {
  enabled: true,
  level: 'info',
  includeSensitiveData: false,
  retentionDays: 90,
  maxFileSize: '100MB',
};
