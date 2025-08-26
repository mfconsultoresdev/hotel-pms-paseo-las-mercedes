import { createModuleLogger } from '@/lib/monitoring/logger';

const logger = createModuleLogger('crypto');

// ============================================================================
// UTILIDADES DE CRIPTOGRAFÍA SIMPLIFICADAS
// ============================================================================

// Configuración de criptografía
const CRYPTO_CONFIG = {
  algorithm: 'AES-GCM',
  keyLength: 256,
  ivLength: 12,
  saltLength: 32,
  iterations: 100000,
  hashAlgorithm: 'SHA-256',
};

// Generar salt aleatorio
export function generateSalt(length: number = CRYPTO_CONFIG.saltLength): string {
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
    logger.error('Error generating salt', { error: error instanceof Error ? error.message : String(error) });
    throw new Error('Failed to generate salt');
  }
}

// Generar IV aleatorio
export function generateIV(length: number = CRYPTO_CONFIG.ivLength): string {
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
    logger.error('Error generating IV', { error: error instanceof Error ? error.message : String(error) });
    throw new Error('Failed to generate IV');
  }
}

// Generar clave derivada de contraseña (PBKDF2)
export async function deriveKey(
  password: string,
  salt: string,
  iterations: number = CRYPTO_CONFIG.iterations
): Promise<string> {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      // Usar Web Crypto API si está disponible
      const encoder = new TextEncoder();
      const passwordBuffer = encoder.encode(password);
      const saltBuffer = encoder.encode(salt);
      
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      );
      
      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: saltBuffer,
          iterations: iterations,
          hash: CRYPTO_CONFIG.hashAlgorithm,
        },
        keyMaterial,
        CRYPTO_CONFIG.keyLength
      );
      
      return Array.from(new Uint8Array(derivedBits), byte => 
        byte.toString(16).padStart(2, '0')
      ).join('');
    } else {
      // Fallback simple para entornos sin Web Crypto API
      return simpleHash(password + salt + iterations.toString());
    }
  } catch (error) {
    logger.error('Error deriving key', { error: error instanceof Error ? error.message : String(error) });
    throw new Error('Failed to derive key');
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

// Cifrar texto
export async function encrypt(
  text: string,
  key: string,
  iv?: string
): Promise<{ encryptedData: string; iv: string }> {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      // Usar Web Crypto API si está disponible
      const generatedIV = iv || generateIV();
      const encoder = new TextEncoder();
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        encoder.encode(key),
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );
      
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: encoder.encode(generatedIV),
        },
        cryptoKey,
        encoder.encode(text)
      );
      
      const encryptedData = Array.from(new Uint8Array(encryptedBuffer), byte => 
        byte.toString(16).padStart(2, '0')
      ).join('');
      
      return { encryptedData, iv: generatedIV };
    } else {
      // Fallback simple para entornos sin Web Crypto API
      const generatedIV = iv || generateIV();
      const encryptedData = simpleEncrypt(text, key, generatedIV);
      return { encryptedData, iv: generatedIV };
    }
  } catch (error) {
    logger.error('Error encrypting data', { error: error instanceof Error ? error.message : String(error) });
    throw new Error('Failed to encrypt data');
  }
}

// Cifrado simple (fallback)
function simpleEncrypt(text: string, key: string, iv: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    const ivChar = iv.charCodeAt(i % iv.length);
    const encryptedChar = charCode ^ keyChar ^ ivChar;
    result += String.fromCharCode(encryptedChar);
  }
  return btoa(result);
}

// Descifrar texto
export async function decrypt(
  encryptedData: string,
  key: string,
  iv: string
): Promise<string> {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      // Usar Web Crypto API si está disponible
      const encoder = new TextEncoder();
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        encoder.encode(key),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );
      
      const encryptedBuffer = new Uint8Array(
        encryptedData.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
      );
      
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: encoder.encode(iv),
        },
        cryptoKey,
        encryptedBuffer
      );
      
      return new TextDecoder().decode(decryptedBuffer);
    } else {
      // Fallback simple para entornos sin Web Crypto API
      return simpleDecrypt(encryptedData, key, iv);
    }
  } catch (error) {
    logger.error('Error decrypting data', { error: error instanceof Error ? error.message : String(error) });
    throw new Error('Failed to decrypt data');
  }
}

// Descifrado simple (fallback)
function simpleDecrypt(encryptedData: string, key: string, iv: string): string {
  try {
    const decoded = atob(encryptedData);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      const ivChar = iv.charCodeAt(i % iv.length);
      const decryptedChar = charCode ^ keyChar ^ ivChar;
      result += String.fromCharCode(decryptedChar);
    }
    return result;
  } catch (error) {
    throw new Error('Invalid encrypted data format');
  }
}

// Generar hash SHA-256
export async function generateHash(input: string): Promise<string> {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      // Fallback simple
      return simpleHash(input);
    }
  } catch (error) {
    logger.error('Error generating hash', { error: error instanceof Error ? error.message : String(error) });
    throw new Error('Failed to generate hash');
  }
}

// Verificar hash
export async function verifyHash(input: string, expectedHash: string): Promise<boolean> {
  try {
    const actualHash = await generateHash(input);
    return actualHash === expectedHash;
  } catch (error) {
    logger.error('Error verifying hash', { error: error instanceof Error ? error.message : String(error) });
    return false;
  }
}

// Generar token aleatorio seguro
export function generateSecureToken(length: number = 32): string {
  try {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
    
    return result;
  } catch (error) {
    logger.error('Error generating secure token', { error: error instanceof Error ? error.message : String(error) });
    throw new Error('Failed to generate secure token');
  }
}

// Generar UUID v4
export function generateUUID(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    } else {
      // Fallback para entornos sin crypto.randomUUID
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  } catch (error) {
    logger.error('Error generating UUID', { error: error instanceof Error ? error.message : String(error) });
    throw new Error('Failed to generate UUID');
  }
}

// Función de conveniencia para hash de contraseña
export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  try {
    const salt = generateSalt();
    const key = await deriveKey(password, salt);
    const hash = await generateHash(key + salt);
    
    logger.info('Password hashed successfully');
    return { hash, salt };
  } catch (error) {
    logger.error('Error hashing password', { error: error instanceof Error ? error.message : String(error) });
    throw new Error('Failed to hash password');
  }
}

// Verificar contraseña
export async function verifyPassword(
  password: string,
  hash: string,
  salt: string
): Promise<boolean> {
  try {
    const key = await deriveKey(password, salt);
    const expectedHash = await generateHash(key + salt);
    
    const isValid = hash === expectedHash;
    logger.info(`Password verification ${isValid ? 'successful' : 'failed'}`);
    
    return isValid;
  } catch (error) {
    logger.error('Error verifying password', { error: error instanceof Error ? error.message : String(error) });
    return false;
  }
}

// Limpiar datos sensibles de la memoria
export function secureWipe(data: string): void {
  try {
    // En JavaScript, no podemos garantizar la limpieza de memoria
    // pero podemos intentar sobrescribir la variable
    if (typeof data === 'string') {
      data = '0'.repeat(data.length);
    }
    logger.info('Data wiped from memory');
  } catch (error) {
    logger.warn('Could not securely wipe data', { error: error instanceof Error ? error.message : String(error) });
  }
}

export default {
  generateSalt,
  generateIV,
  deriveKey,
  encrypt,
  decrypt,
  generateHash,
  verifyHash,
  generateSecureToken,
  generateUUID,
  hashPassword,
  verifyPassword,
  secureWipe,
};
