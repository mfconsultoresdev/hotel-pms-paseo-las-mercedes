import { NextRequest, NextResponse } from 'next/server';
import { createModuleLogger } from '@/lib/monitoring/logger';

const logger = createModuleLogger('security-middleware');

// Configuración de seguridad
const SECURITY_CONFIG = {
  maxRequestsPerMinute: 100,
  maxRequestsPerHour: 1000,
  blockSuspiciousIPs: true,
  requireHTTPS: process.env.NODE_ENV === 'production',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
  blockedUserAgents: [
    'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python-requests'
  ],
};

// Cache para rate limiting
const requestCache = new Map<string, { count: number; resetTime: number }>();

// Middleware de seguridad principal
export function securityMiddleware(request: NextRequest) {
  try {
    const startTime = Date.now();
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    const origin = request.headers.get('origin') || '';

    // 1. Verificar HTTPS en producción
    if (SECURITY_CONFIG.requireHTTPS && request.nextUrl.protocol !== 'https:') {
      logger.warn(`HTTPS required but request was ${request.nextUrl.protocol}`, { clientIP });
      return NextResponse.redirect(
        new URL(`https://${request.nextUrl.host}${request.nextUrl.pathname}`, request.url)
      );
    }

    // 2. Verificar origen (CORS)
    if (!isOriginAllowed(origin)) {
      logger.warn(`Blocked request from unauthorized origin: ${origin}`, { clientIP });
      return new NextResponse('Forbidden', { status: 403 });
    }

    // 3. Verificar User-Agent
    if (isBlockedUserAgent(userAgent)) {
      logger.warn(`Blocked request with suspicious User-Agent: ${userAgent}`, { clientIP });
      return new NextResponse('Forbidden', { status: 403 });
    }

    // 4. Rate limiting
    const rateLimitResult = checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      logger.warn(`Rate limit exceeded for IP: ${clientIP}`, { 
        clientIP, 
        limit: rateLimitResult.limit,
        window: rateLimitResult.window 
      });
      return new NextResponse('Too Many Requests', { 
        status: 429,
        headers: {
          'Retry-After': rateLimitResult.retryAfter.toString(),
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        }
      });
    }

    // 5. Verificar IP sospechosa
    if (SECURITY_CONFIG.blockSuspiciousIPs && isSuspiciousIP(clientIP)) {
      logger.warn(`Blocked suspicious IP: ${clientIP}`);
      return new NextResponse('Forbidden', { status: 403 });
    }

    // 6. Agregar headers de seguridad
    const response = NextResponse.next();
    addSecurityHeaders(response);

    // 7. Log de la solicitud
    const duration = Date.now() - startTime;
    logger.info(`Security check passed`, {
      clientIP,
      userAgent: userAgent.substring(0, 100),
      origin,
      duration,
      method: request.method,
      path: request.nextUrl.pathname,
    });

    return response;

  } catch (error) {
    logger.error('Error in security middleware', { error: error instanceof Error ? error.message : String(error), clientIP: getClientIP(request) });
    // En caso de error, permitir la solicitud pero logear el problema
    return NextResponse.next();
  }
}

// Obtener IP del cliente
function getClientIP(request: NextRequest): string {
  // Verificar headers de proxy
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback a la IP directa
  return request.ip || 'unknown';
}

// Verificar si el origen está permitido
function isOriginAllowed(origin: string): boolean {
  if (SECURITY_CONFIG.allowedOrigins.includes('*')) return true;
  return SECURITY_CONFIG.allowedOrigins.includes(origin);
}

// Verificar si el User-Agent está bloqueado
function isBlockedUserAgent(userAgent: string): boolean {
  const lowerUA = userAgent.toLowerCase();
  return SECURITY_CONFIG.blockedUserAgents.some(blocked => 
    lowerUA.includes(blocked.toLowerCase())
  );
}

// Verificar rate limiting
function checkRateLimit(clientIP: string): {
  allowed: boolean;
  limit: number;
  window: string;
  retryAfter: number;
  resetTime: number;
} {
  const now = Date.now();
  const minuteKey = `${clientIP}:minute:${Math.floor(now / 60000)}`;
  const hourKey = `${clientIP}:hour:${Math.floor(now / 3600000)}`;

  // Limpiar cache expirado
  cleanupExpiredCache();

  // Verificar límite por minuto
  const minuteData = requestCache.get(minuteKey) || { count: 0, resetTime: now + 60000 };
  if (minuteData.count >= SECURITY_CONFIG.maxRequestsPerMinute) {
    return {
      allowed: false,
      limit: SECURITY_CONFIG.maxRequestsPerMinute,
      window: 'minute',
      retryAfter: Math.ceil((minuteData.resetTime - now) / 1000),
      resetTime: minuteData.resetTime,
    };
  }

  // Verificar límite por hora
  const hourData = requestCache.get(hourKey) || { count: 0, resetTime: now + 3600000 };
  if (hourData.count >= SECURITY_CONFIG.maxRequestsPerHour) {
    return {
      allowed: false,
      limit: SECURITY_CONFIG.maxRequestsPerHour,
      window: 'hour',
      retryAfter: Math.ceil((hourData.resetTime - now) / 1000),
      resetTime: hourData.resetTime,
    };
  }

  // Incrementar contadores
  requestCache.set(minuteKey, { count: minuteData.count + 1, resetTime: minuteData.resetTime });
  requestCache.set(hourKey, { count: hourData.count + 1, resetTime: hourData.resetTime });

  return {
    allowed: true,
    limit: SECURITY_CONFIG.maxRequestsPerMinute,
    window: 'minute',
    retryAfter: 0,
    resetTime: minuteData.resetTime,
  };
}

// Limpiar cache expirado
function cleanupExpiredCache(): void {
  const now = Date.now();
  for (const [key, data] of requestCache.entries()) {
    if (data.resetTime < now) {
      requestCache.delete(key);
    }
  }
}

// Verificar si la IP es sospechosa
function isSuspiciousIP(clientIP: string): boolean {
  // Lista simple de IPs sospechosas (en producción, usar servicio externo)
  const suspiciousIPs = [
    '0.0.0.0',
    '127.0.0.1',
    '::1',
    'localhost',
  ];

  return suspiciousIPs.includes(clientIP);
}

// Agregar headers de seguridad
function addSecurityHeaders(response: NextResponse): void {
  // Headers básicos de seguridad
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy básico
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );

  // Headers adicionales
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
}

// Middleware específico para autenticación
export function authMiddleware(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      logger.warn('Request without authentication token', { 
        clientIP: getClientIP(request),
        path: request.nextUrl.pathname 
      });
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Aquí se verificaría el token JWT
    // Por ahora, solo verificamos que exista
    if (token.length < 10) {
      logger.warn('Invalid token format', { 
        clientIP: getClientIP(request),
        tokenLength: token.length 
      });
      return new NextResponse('Invalid token', { status: 401 });
    }

    return NextResponse.next();

  } catch (error) {
    logger.error('Error in auth middleware', { error: error instanceof Error ? error.message : String(error) });
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Middleware para logging de auditoría
export function auditMiddleware(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    const userId = request.headers.get('x-user-id') || 'anonymous';

    // Log de acceso
    logger.info('API access', {
      userId,
      clientIP,
      userAgent: userAgent.substring(0, 100),
      method: request.method,
      path: request.nextUrl.pathname,
      query: Object.fromEntries(request.nextUrl.searchParams),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.next();

  } catch (error) {
    logger.error('Error in audit middleware', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.next();
  }
}

// Función para aplicar múltiples middlewares
export function applySecurityMiddlewares(
  request: NextRequest,
  middlewares: Array<(req: NextRequest) => NextResponse | null>
): NextResponse | null {
  for (const middleware of middlewares) {
    try {
      const result = middleware(request);
      if (result) return result;
    } catch (error) {
      logger.error('Middleware error', { 
        middleware: middleware.name, 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  return null;
}

export default securityMiddleware;
