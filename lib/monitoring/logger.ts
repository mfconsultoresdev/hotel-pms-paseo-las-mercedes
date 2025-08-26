// Logger simplificado para producción
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${message}`, meta || '');
  },
  error: (message: string, meta?: any) => {
    console.error(`[ERROR] ${message}`, meta || '');
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${message}`, meta || '');
  },
  debug: (message: string, meta?: any) => {
    console.log(`[DEBUG] ${message}`, meta || '');
  }
};

export const createModuleLogger = (module: string) => ({
  info: (message: string, meta?: any) => logger.info(`[${module}] ${message}`, meta),
  error: (message: string, meta?: any) => logger.error(`[${module}] ${message}`, meta),
  warn: (message: string, meta?: any) => logger.warn(`[${module}] ${message}`, meta),
  debug: (message: string, meta?: any) => logger.debug(`[${module}] ${message}`, meta)
});
