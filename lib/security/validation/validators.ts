import { createModuleLogger } from '@/lib/monitoring/logger';

const logger = createModuleLogger('security-validators');

// ============================================================================
// VALIDADORES DE SEGURIDAD SIMPLIFICADOS
// ============================================================================

// Configuración de validación
const VALIDATION_CONFIG = {
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true,
    disallowedPatterns: [
      /password/i,
      /123456/i,
      /qwerty/i,
      /admin/i,
      /user/i,
    ],
  },
  username: {
    minLength: 3,
    maxLength: 50,
    allowedChars: /^[a-zA-Z0-9._-]+$/,
    disallowedPatterns: [
      /admin/i,
      /root/i,
      /system/i,
      /test/i,
    ],
  },
  email: {
    maxLength: 254,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    maxLength: 20,
  },
};

// Resultado de validación
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100
}

// Validar contraseña
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  try {
    // Verificar longitud mínima
    if (password.length < VALIDATION_CONFIG.password.minLength) {
      errors.push(`Password must be at least ${VALIDATION_CONFIG.password.minLength} characters long`);
      score -= 20;
    }

    // Verificar longitud máxima
    if (password.length > VALIDATION_CONFIG.password.maxLength) {
      errors.push(`Password must not exceed ${VALIDATION_CONFIG.password.maxLength} characters`);
      score -= 10;
    }

    // Verificar mayúsculas
    if (VALIDATION_CONFIG.password.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
      score -= 15;
    }

    // Verificar minúsculas
    if (VALIDATION_CONFIG.password.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
      score -= 15;
    }

    // Verificar números
    if (VALIDATION_CONFIG.password.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
      score -= 15;
    }

    // Verificar caracteres especiales
    if (VALIDATION_CONFIG.password.requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
      score -= 15;
    }

    // Verificar patrones no permitidos
    for (const pattern of VALIDATION_CONFIG.password.disallowedPatterns) {
      if (pattern.test(password)) {
        errors.push('Password contains commonly used patterns that are not allowed');
        score -= 25;
        break;
      }
    }

    // Verificar repetición de caracteres
    if (/(.)\1{2,}/.test(password)) {
      warnings.push('Password contains repeated characters which may reduce security');
      score -= 5;
    }

    // Verificar secuencias comunes
    if (/123|abc|qwe/i.test(password)) {
      warnings.push('Password contains common sequences which may reduce security');
      score -= 10;
    }

    // Verificar longitud óptima
    if (password.length >= 12) {
      score += 10; // Bonus por contraseña larga
    }

    // Verificar complejidad
    const uniqueChars = new Set(password).size;
    if (uniqueChars < password.length * 0.6) {
      warnings.push('Password could benefit from more diverse character usage');
      score -= 5;
    }

    // Asegurar que el score esté en el rango 0-100
    score = Math.max(0, Math.min(100, score));

    logger.info('Password validation completed', { 
      isValid: errors.length === 0, 
      score, 
      errorCount: errors.length 
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score,
    };

  } catch (error) {
    logger.error('Error validating password', { error: error instanceof Error ? error.message : String(error) });
    return {
      isValid: false,
      errors: ['Password validation failed due to system error'],
      warnings: [],
      score: 0,
    };
  }
}

// Validar nombre de usuario
export function validateUsername(username: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  try {
    // Verificar longitud mínima
    if (username.length < VALIDATION_CONFIG.username.minLength) {
      errors.push(`Username must be at least ${VALIDATION_CONFIG.username.minLength} characters long`);
      score -= 20;
    }

    // Verificar longitud máxima
    if (username.length > VALIDATION_CONFIG.username.maxLength) {
      errors.push(`Username must not exceed ${VALIDATION_CONFIG.username.maxLength} characters`);
      score -= 10;
    }

    // Verificar caracteres permitidos
    if (!VALIDATION_CONFIG.username.allowedChars.test(username)) {
      errors.push('Username contains invalid characters. Only letters, numbers, dots, underscores, and hyphens are allowed');
      score -= 25;
    }

    // Verificar patrones no permitidos
    for (const pattern of VALIDATION_CONFIG.username.disallowedPatterns) {
      if (pattern.test(username)) {
        errors.push('Username contains reserved terms that are not allowed');
        score -= 30;
        break;
      }
    }

    // Verificar que no empiece con números o caracteres especiales
    if (!/^[a-zA-Z]/.test(username)) {
      errors.push('Username must start with a letter');
      score -= 15;
    }

    // Verificar que no termine con caracteres especiales
    if (/[._-]$/.test(username)) {
      warnings.push('Username ends with a special character which may cause issues');
      score -= 5;
    }

    // Verificar longitud óptima
    if (username.length >= 6 && username.length <= 20) {
      score += 5; // Bonus por longitud óptima
    }

    // Asegurar que el score esté en el rango 0-100
    score = Math.max(0, Math.min(100, score));

    logger.info('Username validation completed', { 
      isValid: errors.length === 0, 
      score, 
      errorCount: errors.length 
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score,
    };

  } catch (error) {
    logger.error('Error validating username', { error: error instanceof Error ? error.message : String(error) });
    return {
      isValid: false,
      errors: ['Username validation failed due to system error'],
      warnings: [],
      score: 0,
    };
  }
}

// Validar email
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  try {
    // Verificar longitud máxima
    if (email.length > VALIDATION_CONFIG.email.maxLength) {
      errors.push(`Email must not exceed ${VALIDATION_CONFIG.email.maxLength} characters`);
      score -= 20;
    }

    // Verificar formato básico
    if (!VALIDATION_CONFIG.email.pattern.test(email)) {
      errors.push('Email format is invalid');
      score -= 40;
    }

    // Verificar que no esté vacío
    if (!email || email.trim().length === 0) {
      errors.push('Email cannot be empty');
      score -= 50;
    }

    // Verificar que no contenga espacios
    if (/\s/.test(email)) {
      errors.push('Email cannot contain spaces');
      score -= 20;
    }

    // Verificar dominio
    const parts = email.split('@');
    if (parts.length === 2) {
      const domain = parts[1];
      
      // Verificar que el dominio tenga al menos un punto
      if (!domain.includes('.')) {
        errors.push('Email domain is invalid');
        score -= 20;
      }

      // Verificar que el dominio no sea muy corto
      if (domain.length < 3) {
        warnings.push('Email domain seems too short');
        score -= 5;
      }

      // Verificar que el dominio no sea muy largo
      if (domain.length > 253) {
        warnings.push('Email domain is very long');
        score -= 5;
      }
    }

    // Verificar que no contenga caracteres especiales problemáticos
    if (/[<>()[\]\\,;:\s"]/.test(email)) {
      errors.push('Email contains invalid characters');
      score -= 25;
    }

    // Asegurar que el score esté en el rango 0-100
    score = Math.max(0, Math.min(100, score));

    logger.info('Email validation completed', { 
      isValid: errors.length === 0, 
      score, 
      errorCount: errors.length 
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score,
    };

  } catch (error) {
    logger.error('Error validating email', { error: error instanceof Error ? error.message : String(error) });
    return {
      isValid: false,
      errors: ['Email validation failed due to system error'],
      warnings: [],
      score: 0,
    };
  }
}

// Validar número de teléfono
export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  try {
    // Verificar que no esté vacío
    if (!phone || phone.trim().length === 0) {
      errors.push('Phone number cannot be empty');
      score -= 50;
    }

    // Verificar longitud máxima
    if (phone.length > VALIDATION_CONFIG.phone.maxLength) {
      errors.push(`Phone number must not exceed ${VALIDATION_CONFIG.phone.maxLength} characters`);
      score -= 20;
    }

    // Verificar formato básico
    if (!VALIDATION_CONFIG.phone.pattern.test(phone)) {
      errors.push('Phone number format is invalid');
      score -= 30;
    }

    // Verificar que no contenga solo ceros
    if (/^0+$/.test(phone.replace(/[^0-9]/g, ''))) {
      errors.push('Phone number cannot contain only zeros');
      score -= 20;
    }

    // Verificar que no sea muy corto
    const digitsOnly = phone.replace(/[^0-9]/g, '');
    if (digitsOnly.length < 7) {
      warnings.push('Phone number seems too short for a valid number');
      score -= 10;
    }

    // Verificar que no sea muy largo
    if (digitsOnly.length > 15) {
      warnings.push('Phone number seems too long for a valid number');
      score -= 10;
    }

    // Asegurar que el score esté en el rango 0-100
    score = Math.max(0, Math.min(100, score));

    logger.info('Phone validation completed', { 
      isValid: errors.length === 0, 
      score, 
      errorCount: errors.length 
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score,
    };

  } catch (error) {
    logger.error('Error validating phone', { error: error instanceof Error ? error.message : String(error) });
    return {
      isValid: false,
      errors: ['Phone validation failed due to system error'],
      warnings: [],
      score: 0,
    };
  }
}

// Validar URL
export function validateURL(url: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  try {
    // Verificar que no esté vacío
    if (!url || url.trim().length === 0) {
      errors.push('URL cannot be empty');
      score -= 50;
    }

    // Verificar formato básico
    try {
      new URL(url);
    } catch {
      errors.push('URL format is invalid');
      score -= 40;
    }

    // Verificar protocolo
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      warnings.push('URL should use HTTPS protocol for security');
      score -= 10;
    }

    // Verificar longitud
    if (url.length > 2048) {
      warnings.push('URL is very long and may cause issues');
      score -= 5;
    }

    // Asegurar que el score esté en el rango 0-100
    score = Math.max(0, Math.min(100, score));

    logger.info('URL validation completed', { 
      isValid: errors.length === 0, 
      score, 
      errorCount: errors.length 
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score,
    };

  } catch (error) {
    logger.error('Error validating URL', { error: error instanceof Error ? error.message : String(error) });
    return {
      isValid: false,
      errors: ['URL validation failed due to system error'],
      warnings: [],
      score: 0,
    };
  }
}

// Validar entrada general de texto
export function validateTextInput(
  text: string,
  options: {
    minLength?: number;
    maxLength?: number;
    allowedChars?: RegExp;
    disallowedPatterns?: RegExp[];
    required?: boolean;
  } = {}
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  try {
    const {
      minLength = 1,
      maxLength = 1000,
      allowedChars,
      disallowedPatterns = [],
      required = true,
    } = options;

    // Verificar si es requerido
    if (required && (!text || text.trim().length === 0)) {
      errors.push('This field is required');
      score -= 50;
    }

    // Verificar longitud mínima
    if (text && text.length < minLength) {
      errors.push(`Text must be at least ${minLength} characters long`);
      score -= 20;
    }

    // Verificar longitud máxima
    if (text && text.length > maxLength) {
      errors.push(`Text must not exceed ${maxLength} characters`);
      score -= 20;
    }

    // Verificar caracteres permitidos
    if (allowedChars && text && !allowedChars.test(text)) {
      errors.push('Text contains invalid characters');
      score -= 25;
    }

    // Verificar patrones no permitidos
    for (const pattern of disallowedPatterns) {
      if (pattern.test(text)) {
        errors.push('Text contains disallowed patterns');
        score -= 20;
        break;
      }
    }

    // Verificar longitud óptima
    if (text && text.length >= minLength && text.length <= maxLength) {
      score += 5; // Bonus por longitud apropiada
    }

    // Asegurar que el score esté en el rango 0-100
    score = Math.max(0, Math.min(100, score));

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score,
    };

  } catch (error) {
    logger.error('Error validating text input', { error: error instanceof Error ? error.message : String(error) });
    return {
      isValid: false,
      errors: ['Text validation failed due to system error'],
      warnings: [],
      score: 0,
    };
  }
}

// Función de conveniencia para validación múltiple
export function validateMultiple(
  validations: Array<{ field: string; value: string; validator: (value: string) => ValidationResult }>
): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {};

  for (const validation of validations) {
    try {
      results[validation.field] = validation.validator(validation.value);
    } catch (error) {
      logger.error(`Error validating field ${validation.field}`, { error: error instanceof Error ? error.message : String(error) });
      results[validation.field] = {
        isValid: false,
        errors: [`Validation failed for ${validation.field}`],
        warnings: [],
        score: 0,
      };
    }
  }

  return results;
}

export default {
  validatePassword,
  validateUsername,
  validateEmail,
  validatePhone,
  validateURL,
  validateTextInput,
  validateMultiple,
};
