import { createModuleLogger } from '@/lib/monitoring/logger';

const logger = createModuleLogger('cache-manager');

// Cache manager simplificado para producción
class CacheManager {
  private cache: Map<string, { value: any; expiry: number }> = new Map();
  private defaultTTL: number = 300000; // 5 minutos

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = this.cache.get(key);
      
      if (!item) {
        logger.debug(`Cache miss for key: ${key}`);
        return null;
      }

      if (Date.now() > item.expiry) {
        this.cache.delete(key);
        logger.debug(`Cache expired for key: ${key}`);
        return null;
      }

      logger.debug(`Cache hit for key: ${key}`);
      return item.value as T;
    } catch (error) {
      logger.error(`Error getting cache key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const expiry = Date.now() + (ttl || this.defaultTTL);
      this.cache.set(key, { value, expiry });
      logger.debug(`Cache set for key: ${key}, TTL: ${ttl || this.defaultTTL}ms`);
    } catch (error) {
      logger.error(`Error setting cache key ${key}:`, error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      this.cache.delete(key);
      logger.debug(`Cache deleted for key: ${key}`);
    } catch (error) {
      logger.error(`Error deleting cache key ${key}:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      this.cache.clear();
      logger.info('Cache cleared');
    } catch (error) {
      logger.error('Error clearing cache:', error);
    }
  }

  async getStats(): Promise<{ size: number; keys: string[] }> {
    try {
      const keys = Array.from(this.cache.keys());
      return {
        size: this.cache.size,
        keys
      };
    } catch (error) {
      logger.error('Error getting cache stats:', error);
      return { size: 0, keys: [] };
    }
  }
}

export const cacheManager = new CacheManager();
export default cacheManager;
