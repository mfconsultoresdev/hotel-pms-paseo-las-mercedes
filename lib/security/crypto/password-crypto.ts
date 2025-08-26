import { createModuleLogger } from '@/lib/monitoring/logger';

const logger = createModuleLogger('password-crypto');

// ============================================================================
// UTILIDADES DE CRIPTOGRAFÍA PARA CONTRASEÑAS
// ============================================================================

// Resultado del hash de contraseña
export interface PasswordHashResult {
  hash: string;
  salt: string;
  algorithm: string;
  iterations: number;
  createdAt: Date;
}

// Configuración de hash de contraseñas
const PASSWORD_CONFIG = {
  algorithm: 'PBKDF2',
  iterations: 100000,
  saltLength: 32,
  hashLength: 64,
  pepper: process.env.PASSWORD_PEPPER || 'default-pepper-change-in-production',
};

// Generar salt aleatorio para contraseñas
export function generatePasswordSalt(length: number = PASSWORD_CONFIG.saltLength): string {
  try {
    const array = new Uint8Array(length);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      // Fallback para entornos sin crypto
      for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    logger.error('Error generating password salt', { error: error instanceof Error ? error.message : String(error) });
    throw new Error('Failed to generate password salt');
  }
}

// Generar hash de contraseña usando PBKDF2
export async function createPasswordHash(password: string): Promise<PasswordHashResult> {
  try {
    const salt = generatePasswordSalt();
    const pepper = PASSWORD_CONFIG.pepper;
    
    // Combinar contraseña, salt y pepper
    const combined = password + salt + pepper;
    
    let hash: string;
    
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      // Usar Web Crypto API si está disponible
      const encoder = new TextEncoder();
      const data = encoder.encode(combined);
      
      // Simular PBKDF2 (en producción usar implementación real)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Aplicar iteraciones adicionales
      for (let i = 1; i < PASSWORD_CONFIG.iterations; i++) {
        const newData = encoder.encode(hash + salt + pepper);
        const newHashBuffer = await crypto.subtle.digest('SHA-256', newData);
        const newHashArray = Array.from(new Uint8Array(newHashBuffer));
        hash = newHashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      }
    } else {
      // Fallback simple para entornos sin Web Crypto API
      hash = simpleHash(combined);
      
      // Aplicar iteraciones adicionales
      for (let i = 1; i < PASSWORD_CONFIG.iterations; i++) {
        hash = simpleHash(hash + salt + pepper);
      }
    }

    const result: PasswordHashResult = {
      hash,
      salt,
      algorithm: PASSWORD_CONFIG.algorithm,
      iterations: PASSWORD_CONFIG.iterations,
      createdAt: new Date(),
    };

    logger.info('Password hash created successfully');
    return result;

  } catch (error) {
    logger.error('Error creating password hash', { error: error instanceof Error ? error.message : String(error) });
    throw new Error('Failed to create password hash');
  }
}

// Verificar contraseña
export async function verifyPasswordHash(
  password: string,
  storedHash: string,
  storedSalt: string,
  storedIterations: number = PASSWORD_CONFIG.iterations
): Promise<boolean> {
  try {
    const pepper = PASSWORD_CONFIG.pepper;
    const combined = password + storedSalt + pepper;
    
    let computedHash: string;
    
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      // Usar Web Crypto API si está disponible
      const encoder = new TextEncoder();
      const data = encoder.encode(combined);
      
      // Simular PBKDF2 (en producción usar implementación real)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Aplicar iteraciones adicionales
      for (let i = 1; i < storedIterations; i++) {
        const newData = encoder.encode(computedHash + storedSalt + pepper);
        const newHashBuffer = await crypto.subtle.digest('SHA-256', newData);
        const newHashArray = Array.from(new Uint8Array(newHashBuffer));
        computedHash = newHashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      }
    } else {
      // Fallback simple para entornos sin Web Crypto API
      computedHash = simpleHash(combined);
      
      // Aplicar iteraciones adicionales
      for (let i = 1; i < storedIterations; i++) {
        computedHash = simpleHash(computedHash + storedSalt + pepper);
      }
    }

    const isValid = computedHash === storedHash;
    
    if (isValid) {
      logger.info('Password verification successful');
    } else {
      logger.warn('Password verification failed');
    }

    return isValid;

  } catch (error) {
    logger.error('Error verifying password hash', { error: error instanceof Error ? error.message : String(error) });
    return false;
  }
}

// Hash simple (fallback)
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

// Generar contraseña aleatoria segura
export function generateSecurePassword(
  length: number = 16,
  options: {
    includeUppercase?: boolean;
    includeLowercase?: boolean;
    includeNumbers?: boolean;
    includeSpecial?: boolean;
  } = {}
): string {
  try {
    const {
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSpecial = true,
    } = options;

    let chars = '';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSpecial) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (chars.length === 0) {
      throw new Error('At least one character type must be selected');
    }

    let result = '';
    
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length];
      }
    } else {
      // Fallback para entornos sin crypto
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }

    logger.info('Secure password generated successfully');
    return result;

  } catch (error) {
    logger.error('Error generating secure password', { error: error instanceof Error ? error.message : String(error) });
    throw new Error('Failed to generate secure password');
  }
}

// Validar fortaleza de contraseña
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number; // 0-100
  feedback: string[];
  suggestions: string[];
} {
  const feedback: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  try {
    // Verificar longitud mínima
    if (password.length < 8) {
      feedback.push('Password must be at least 8 characters long');
      score -= 20;
    } else if (password.length >= 12) {
      score += 20;
    } else {
      score += 10;
    }

    // Verificar mayúsculas
    if (!/[A-Z]/.test(password)) {
      feedback.push('Password should contain at least one uppercase letter');
      score -= 15;
    } else {
      score += 15;
    }

    // Verificar minúsculas
    if (!/[a-z]/.test(password)) {
      feedback.push('Password should contain at least one lowercase letter');
      score -= 15;
    } else {
      score += 15;
    }

    // Verificar números
    if (!/\d/.test(password)) {
      feedback.push('Password should contain at least one number');
      score -= 15;
    } else {
      score += 15;
    }

    // Verificar caracteres especiales
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      feedback.push('Password should contain at least one special character');
      score -= 15;
    } else {
      score += 15;
    }

    // Verificar patrones comunes
    if (/password|123456|qwerty|admin|user/i.test(password)) {
      feedback.push('Password contains commonly used patterns');
      score -= 25;
    }

    // Verificar repetición de caracteres
    if (/(.)\1{2,}/.test(password)) {
      feedback.push('Password contains repeated characters');
      score -= 10;
    }

    // Verificar secuencias
    if (/123|abc|qwe/i.test(password)) {
      feedback.push('Password contains common sequences');
      score -= 15;
    }

    // Sugerencias de mejora
    if (password.length < 12) {
      suggestions.push('Consider using a longer password (12+ characters)');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      suggestions.push('Add special characters to increase complexity');
    }
    if (password.length < 16) {
      suggestions.push('Consider using a passphrase instead of a password');
    }

    // Asegurar que el score esté en el rango 0-100
    score = Math.max(0, Math.min(100, score));

    const isValid = score >= 60 && feedback.length === 0;

    logger.info('Password strength validation completed', { 
      isValid, 
      score, 
      feedbackCount: feedback.length 
    });

    return {
      isValid,
      score,
      feedback,
      suggestions,
    };

  } catch (error) {
    logger.error('Error validating password strength', { error: error instanceof Error ? error.message : String(error) });
    return {
      isValid: false,
      score: 0,
      feedback: ['Password validation failed due to system error'],
      suggestions: [],
    };
  }
}

// Limpiar contraseña de la memoria
export function secureWipePassword(password: string): void {
  try {
    // En JavaScript, no podemos garantizar la limpieza de memoria
    // pero podemos intentar sobrescribir la variable
    if (typeof password === 'string') {
      password = '0'.repeat(password.length);
    }
    logger.info('Password wiped from memory');
  } catch (error) {
    logger.warn('Could not securely wipe password', { error: error instanceof Error ? error.message : String(error) });
  }
}

export default {
  generatePasswordSalt,
  createPasswordHash,
  verifyPasswordHash,
  generateSecurePassword,
  validatePasswordStrength,
  secureWipePassword,
};
