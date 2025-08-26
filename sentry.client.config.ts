// Configuración de Sentry simplificada para producción
// En producción, instalar: npm install @sentry/nextjs

// Mock de Sentry para desarrollo
const Sentry = {
  init: (config: any) => {
    if (process.env.NODE_ENV === 'production') {
      console.warn('Sentry no está configurado. Instala @sentry/nextjs para monitoreo de errores en producción.');
    }
  },
  captureException: (error: any) => {
    if (process.env.NODE_ENV === 'production') {
      console.error('Error capturado por Sentry:', error);
    }
  },
  captureMessage: (message: string) => {
    if (process.env.NODE_ENV === 'production') {
      console.log('Mensaje capturado por Sentry:', message);
    }
  },
  setUser: (user: any) => {
    if (process.env.NODE_ENV === 'production') {
      console.log('Usuario establecido en Sentry:', user);
    }
  },
  setTag: (key: string, value: string) => {
    if (process.env.NODE_ENV === 'production') {
      console.log('Tag establecido en Sentry:', key, value);
    }
  },
  setContext: (name: string, context: any) => {
    if (process.env.NODE_ENV === 'production') {
      console.log('Contexto establecido en Sentry:', name, context);
    }
  },
  addBreadcrumb: (breadcrumb: any) => {
    if (process.env.NODE_ENV === 'production') {
      console.log('Breadcrumb agregado a Sentry:', breadcrumb);
    }
  },
  withProfiler: (name: string, fn: Function) => {
    return fn();
  },
  startTransaction: (context: any) => {
    return {
      finish: () => {},
      setTag: () => {},
      setData: () => {},
      setStatus: () => {},
    };
  },
};

// Inicializar Sentry solo si está configurado
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
} else {
  console.log('Sentry no configurado. NEXT_PUBLIC_SENTRY_DSN no está definido.');
}

export default Sentry;
